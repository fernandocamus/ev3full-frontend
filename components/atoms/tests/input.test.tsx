import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from '../input';

describe('Input', () => {
    it('debe renderizar con el valor inicial', () => {
        render(<Input value="Texto inicial" onChange={() => { }} />);
        const input = screen.getByDisplayValue('Texto inicial');
        expect(input).toBeInTheDocument();
    });

    it('debe llamar a onChange con el nuevo valor', () => {
        const handleChange = vi.fn();
        render(<Input value="" onChange={handleChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'nuevo valor' } });
        expect(handleChange).toHaveBeenCalledWith('nuevo valor');
    });

    it('debe transformar el valor a mayúsculas cuando uppercase=true', () => {
        const handleChange = vi.fn();
        render(<Input value="" onChange={handleChange} uppercase />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'hola' } });
        expect(handleChange).toHaveBeenCalledWith('HOLA');
    });

    it('debe renderizar con el placeholder correcto', () => {
        render(<Input value="" onChange={() => { }} placeholder="Escribe aquí" />);
        const input = screen.getByPlaceholderText('Escribe aquí');
        expect(input).toBeInTheDocument();
    });

    it('debe renderizar con el tipo correcto (type)', () => {
        render(<Input value="" onChange={() => { }} type="password" placeholder="test-password" />);
        const input = screen.getByPlaceholderText('test-password');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('debe estar deshabilitado cuando disabled=true', () => {
        render(<Input value="" onChange={() => { }} disabled />);
        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
    });

    it('debe aceptar className adicional y aplicarlo al input', () => {
        render(<Input value="" onChange={() => { }} className="extra-class" />);
        const input = screen.getByRole('textbox');
        expect(input.className).toContain('extra-class');
    });

    it('debe llamar a onKeyPress cuando se presiona una tecla', () => {
        const handleKeyPress = vi.fn();
        render(<Input value="" onChange={() => { }} onKeyPress={handleKeyPress} />);
        const input = screen.getByRole('textbox');
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(handleKeyPress).toHaveBeenCalled();
    });
});
