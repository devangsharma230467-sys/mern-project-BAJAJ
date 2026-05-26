const request = require('supertest');
const app = require('../src/app');
const Ticket = require('../src/models/Ticket');

jest.mock('../src/models/Ticket');

describe('Ticket API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/health', () => {
    test('returns uptime and ok status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.uptime).toBeDefined();
    });
  });

  describe('GET /api/tickets', () => {
    test('returns empty array when no tickets exist', async () => {
      Ticket.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      const res = await request(app).get('/api/tickets');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    test('returns list of enriched tickets', async () => {
      const mockTickets = [
        {
          _id: '65f1234567890abcdef12345',
          subject: 'Database connection pooling issue',
          description: 'Spikes in query times',
          customerEmail: 'devops@company.com',
          status: 'open',
          priority: 'high',
          createdAt: new Date(Date.now() - 600000), // 10 minutes ago
          toObject: function() { return this; }
        }
      ];

      Ticket.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTickets),
      });

      const res = await request(app).get('/api/tickets');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].subject).toBe('Database connection pooling issue');
      expect(res.body.data[0].ageMinutes).toBe(10);
      expect(res.body.data[0].slaBreached).toBe(false);
    });
  });

  describe('POST /api/tickets', () => {
    test('successfully creates a support ticket', async () => {
      const newTicketPayload = {
        subject: 'SSO Login Failure',
        description: 'Users cannot log in via Okta Integration',
        customerEmail: 'sso@support.com',
        priority: 'urgent',
      };

      const mockCreated = {
        ...newTicketPayload,
        _id: '65f1234567890abcdef12346',
        status: 'open',
        createdAt: new Date(),
        toObject: function() { return this; }
      };

      Ticket.create.mockResolvedValue(mockCreated);

      const res = await request(app)
        .post('/api/tickets')
        .send(newTicketPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subject).toBe('SSO Login Failure');
      expect(res.body.data.status).toBe('open');
      expect(res.body.data.ageMinutes).toBeDefined();
    });

    test('fails when validation requirements are missing', async () => {
      Ticket.create.mockRejectedValueOnce(new Error('ValidationError: validation failed'));

      const res = await request(app)
        .post('/api/tickets')
        .send({ subject: 'No' }); // Short subject, no email, no description

      expect(res.status).toBe(500); // Standard errorHandler fallback for unhandled schema validation
    });
  });

  describe('PATCH /api/tickets/:id', () => {
    test('updates ticket fields successfully', async () => {
      const ticketId = '65f1234567890abcdef12345';
      const initialTicket = {
        _id: ticketId,
        subject: 'Old Subject',
        description: 'Old Description',
        customerEmail: 'test@domain.com',
        status: 'open',
        priority: 'high',
        createdAt: new Date(),
        toObject: function() { return this; },
        save: jest.fn().mockResolvedValue(true),
      };

      Ticket.findById.mockResolvedValue(initialTicket);

      const res = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .send({ subject: 'Updated Subject' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subject).toBe('Updated Subject');
      expect(initialTicket.save).toHaveBeenCalled();
    });

    test('enforces state machine transition constraints', async () => {
      const ticketId = '65f1234567890abcdef12345';
      const initialTicket = {
        _id: ticketId,
        status: 'open',
        toObject: function() { return this; },
      };

      Ticket.findById.mockResolvedValue(initialTicket);

      const res = await request(app)
        .patch(`/api/tickets/${ticketId}`)
        .send({ status: 'resolved' }); // Invalid transition directly open -> resolved

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Cannot resolve directly');
    });
  });

  describe('GET /api/tickets/stats', () => {
    test('returns aggregate dashboard stats correctly', async () => {
      const mockTickets = [
        {
          status: 'open',
          priority: 'urgent',
          createdAt: new Date(Date.now() - 90 * 60 * 1000), // SLA Breached (90m > 60m threshold)
          resolvedAt: null,
          toObject: function() { return this; }
        },
        {
          status: 'resolved',
          priority: 'medium',
          createdAt: new Date(Date.now() - 100000),
          resolvedAt: new Date(),
          toObject: function() { return this; }
        }
      ];

      Ticket.find.mockResolvedValue(mockTickets);

      const res = await request(app).get('/api/tickets/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(2);
      expect(res.body.data.byStatus.open).toBe(1);
      expect(res.body.data.byStatus.resolved).toBe(1);
      expect(res.body.data.breached).toBe(1);
    });
  });
});
