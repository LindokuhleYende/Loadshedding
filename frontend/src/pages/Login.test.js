import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Login from './Login';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedUsedNavigate,
        Link: function Link(props) {
            return React.createElement('a', { href: props.to }, props.children);
        },
    };
});

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('renders login form', () => {
        renderWithRouter(<Login />);
        expect(screen.getByText(/Login Account/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
        expect(screen.getByText(/Signup/i)).toBeInTheDocument();
    });

    test('inputs update on change', () => {
        renderWithRouter(<Login />);
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    test('successful login as admin navigates to /admin', async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                success: true,
                message: 'Login successful',
                user: { isAdmin: true },
                token: 'fake-token',
            },
        });
        renderWithRouter(<Login />);
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'adminpass' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'https://loadshedding.onrender.com/login',
                { email: 'admin@example.com', password: 'adminpass' },
                { withCredentials: true }
            );
            expect(localStorage.getItem('adminToken')).toBe('fake-token');
            expect(localStorage.getItem('isAdmin')).toBe('true');
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/admin');
        });
    });

    test('successful login as non-admin navigates to /', async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                success: true,
                message: 'Login successful',
                user: { isAdmin: false },
                token: 'fake-token',
            },
        });
        renderWithRouter(<Login />);
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'userpass' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => {
            expect(localStorage.getItem('isAdmin')).toBe('false');
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/', { replace: true });
        });
    });

    test('shows error toast on failed login', async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                success: false,
                message: 'Invalid credentials',
            },
        });
        renderWithRouter(<Login />);
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'fail@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'failpass' } });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => {
            expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
        });
    });
});