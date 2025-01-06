import './globals.css';
import { useState } from 'react';

export default function AboutPage() {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data: { message: string } = await response.json();
        setResponseMessage(data.message || 'Form submitted successfully!');
      } else {
        setResponseMessage('Failed to submit the form. Please try again.');
      }
    } catch (error) {
      setResponseMessage('An error occurred while submitting the form.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Other Content */}
      <div className="mt-12 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={4}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          >
            Submit
          </button>
        </form>
        {responseMessage && (
          <p className="mt-4 text-center text-sm font-medium text-green-600">{responseMessage}</p>
        )}
      </div>
    </main>
  );
}
