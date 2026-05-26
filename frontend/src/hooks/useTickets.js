import { useState, useEffect, useCallback } from 'react';
import { ticketApi } from '../services/api';

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [ticketRes, statsRes] = await Promise.all([
        ticketApi.getAll(filters),
        ticketApi.stats(),
      ]);
      setTickets(ticketRes.data.data);
      setStats(statsRes.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimistic update wrapper
  const updateTicket = async (id, data) => {
    const prev = [...tickets];
    setTickets((t) => t.map((tk) => (tk._id === id ? { ...tk, ...data } : tk)));
    try {
      const res = await ticketApi.update(id, data);
      await fetchData();
      return res.data.data;
    } catch (err) {
      setTickets(prev);
      throw err;
    }
  };

  const createTicket = async (data) => {
    const res = await ticketApi.create(data);
    await fetchData();
    return res.data.data;
  };

  const deleteTicket = async (id) => {
    const prev = [...tickets];
    setTickets((t) => t.filter((tk) => tk._id !== id));
    try {
      await ticketApi.remove(id);
      await fetchData();
    } catch (err) {
      setTickets(prev);
      throw err;
    }
  };

  return {
    tickets, stats, loading, error,
    filters, setFilters,
    createTicket, updateTicket, deleteTicket,
    refresh: fetchData,
  };
}
