import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const initialForm = { subject: '', description: '', customerEmail: '', priority: 'medium' };

export default function CreateTicketForm({ onClose, onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.subject.trim() || form.subject.trim().length < 3) e.subject = 'Subject must be at least 3 characters';
    if (!form.description.trim() || form.description.trim().length < 10) e.description = 'Description must be at least 10 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) e.customerEmail = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onCreate(form);
      toast.success('Ticket created');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const set = (field) => (ev) => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-card p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Create New Ticket</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Subject</label>
            <input
              className={`input-field ${errors.subject ? 'ring-2 ring-rose-400' : ''}`}
              value={form.subject}
              onChange={set('subject')}
              placeholder="Brief summary of the issue"
            />
            {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Description</label>
            <textarea
              className={`input-field min-h-[100px] resize-none ${errors.description ? 'ring-2 ring-rose-400' : ''}`}
              value={form.description}
              onChange={set('description')}
              placeholder="Detailed description of the problem..."
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Customer Email</label>
              <input
                type="email"
                className={`input-field ${errors.customerEmail ? 'ring-2 ring-rose-400' : ''}`}
                value={form.customerEmail}
                onChange={set('customerEmail')}
                placeholder="user@example.com"
              />
              {errors.customerEmail && <p className="text-xs text-rose-500 mt-1">{errors.customerEmail}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Priority</label>
              <select className="input-field" value={form.priority} onChange={set('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
