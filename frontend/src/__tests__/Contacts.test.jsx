import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Contacts from '../pages/Contacts';
import api from '../services/api';

vi.mock('../services/api');

describe('Contacts page', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'k');
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('fetches and displays contacts', async () => {
    api.get.mockResolvedValueOnce({ data: [ { _id: '1', firstName: 'Jean', lastName: 'Dupont', phone: '0612345678', email: 'a@b.com' } ] });
    render(<Contacts />);

    await waitFor(() => expect(screen.getByText(/Jean Dupont/)).toBeInTheDocument());
  });

  test('delete contact flow', async () => {
    api.get.mockResolvedValueOnce({ data: [ { _id: '2', firstName: 'A', lastName: 'B', phone: '0612345678', email: 'a@b.com' } ] });
    api.delete.mockResolvedValueOnce({});
    // mock confirm to always accept
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    render(<Contacts />);

    await waitFor(() => expect(screen.getByText(/A B/)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Supprimer/i }));

    await waitFor(() => expect(api.delete).toHaveBeenCalled());
  });
});
