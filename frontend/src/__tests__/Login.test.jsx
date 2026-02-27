import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';
import api from '../services/api';

vi.mock('../services/api');

describe('Login page', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    delete window.location;
    // mock location as writable
    window.location = { href: '' };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  test('renders form and submits login', async () => {
    api.post.mockResolvedValueOnce({ data: { token: 'tok' } });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

    // wait for promise resolution
    await screen.findByText((_, node) => node === null, {}, { timeout: 100 }).catch(() => {});

    expect(localStorage.getItem('token')).toBe('tok');
    expect(window.location.href).toBe('/contacts');
  });

  test('toggles to signup and submits', async () => {
    api.post.mockResolvedValueOnce({ data: { token: 'tok2' } });
    render(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /Créer un compte/i }));
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'c@d.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /S'inscrire|S'inscrire/i }));

    await screen.findByText((_, node) => node === null, {}, { timeout: 100 }).catch(() => {});
    expect(localStorage.getItem('token')).toBe('tok2');
  });
});
