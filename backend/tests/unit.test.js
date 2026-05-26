const { SLA_LIMITS, getAgeMinutes, isSlaBreached, enrichTicket } = require('../src/utils/sla');
const { ALLOWED_TRANSITIONS, isValidTransition, getTransitionError } = require('../src/utils/transitions');

describe('SLA Calculations', () => {
  test('SLA limits are correctly defined', () => {
    expect(SLA_LIMITS.urgent).toBe(60);
    expect(SLA_LIMITS.high).toBe(240);
    expect(SLA_LIMITS.medium).toBe(1440);
    expect(SLA_LIMITS.low).toBe(4320);
  });

  test('getAgeMinutes calculates elapsed time correctly for active tickets', () => {
    const ticket = {
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
      resolvedAt: null,
    };
    expect(getAgeMinutes(ticket)).toBe(30);
  });

  test('getAgeMinutes stops counting at resolvedAt for resolved tickets', () => {
    const created = new Date(Date.now() - 120 * 60 * 1000); // 2 hours ago
    const resolved = new Date(created.getTime() + 45 * 60 * 1000); // resolved after 45 mins
    const ticket = {
      createdAt: created,
      resolvedAt: resolved,
    };
    expect(getAgeMinutes(ticket)).toBe(45);
  });

  test('isSlaBreached returns true when threshold is exceeded', () => {
    const ticket = {
      createdAt: new Date(Date.now() - 70 * 60 * 1000), // 70 mins ago
      priority: 'urgent', // 60 mins limit
      resolvedAt: null,
    };
    expect(isSlaBreached(ticket)).toBe(true);
  });

  test('isSlaBreached returns false when within SLA threshold', () => {
    const ticket = {
      createdAt: new Date(Date.now() - 50 * 60 * 1000), // 50 mins ago
      priority: 'urgent',
      resolvedAt: null,
    };
    expect(isSlaBreached(ticket)).toBe(false);
  });

  test('enrichTicket correctly adds ageMinutes and slaBreached flags', () => {
    const rawTicket = {
      subject: 'Slow DB queries',
      priority: 'high',
      createdAt: new Date(Date.now() - 300 * 60 * 1000), // 5 hours ago (limit is 4 hours)
      resolvedAt: null,
    };
    const enriched = enrichTicket(rawTicket);
    expect(enriched.ageMinutes).toBe(300);
    expect(enriched.slaBreached).toBe(true);
  });
});

describe('Finite State Machine transitions', () => {
  test('valid transition checks return true', () => {
    expect(isValidTransition('open', 'in_progress')).toBe(true);
    expect(isValidTransition('in_progress', 'resolved')).toBe(true);
    expect(isValidTransition('in_progress', 'open')).toBe(true);
    expect(isValidTransition('resolved', 'closed')).toBe(true);
    expect(isValidTransition('resolved', 'in_progress')).toBe(true);
  });

  test('invalid transition checks return false', () => {
    expect(isValidTransition('open', 'resolved')).toBe(false);
    expect(isValidTransition('open', 'closed')).toBe(false);
    expect(isValidTransition('in_progress', 'closed')).toBe(false);
    expect(isValidTransition('closed', 'open')).toBe(false);
  });

  test('getTransitionError returns descriptive error messages', () => {
    expect(getTransitionError('open', 'resolved')).toContain('Cannot resolve directly');
    expect(getTransitionError('open', 'closed')).toContain('Cannot close directly');
    expect(getTransitionError('closed', 'in_progress')).toContain('Closed tickets cannot be modified');
    expect(getTransitionError('open', 'open')).toContain('already "open"');
  });
});
