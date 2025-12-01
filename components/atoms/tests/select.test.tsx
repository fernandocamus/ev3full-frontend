import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select from '../select';

const mockOptions = [
    { value: 'opcion1', label: 'Opción 1' },
    { value: 'opcion2', label: 'Opción 2' },
    { value: 'opcion3', label: 'Opción 3' },
];

describe('Select', () => {
    it('debe renderizar el placeholder por defecto', () => {
        render(<Select value="" onChange={() => { }} options={mockOptions} />);
        expect(screen.getByText('Seleccionar...')).toBeInTheDocument();
    });

    it('debe renderizar el placeholder personalizado', () => {
        render(<Select value="" onChange={() => { }} options={mockOptions} placeholder="Elige una opción" />);
        expect(screen.getByText('Elige una opción')).toBeInTheDocument();
    });

    it('debe renderizar todas las opciones', () => {
        render(<Select value="" onChange={() => { }} options={mockOptions} />);
        expect(screen.getByText('Opción 1')).toBeInTheDocument();
        expect(screen.getByText('Opción 2')).toBeInTheDocument();
        expect(screen.getByText('Opción 3')).toBeInTheDocument();
    });

    it('debe llamar a onChange con el valor seleccionado', () => {
        const handleChange = vi.fn();
        render(<Select value="" onChange={handleChange} options={mockOptions} />);
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'opcion2' } });
        expect(handleChange).toHaveBeenCalledWith('opcion2');
    });

    it('debe mostrar el valor seleccionado', () => {
        render(<Select value="opcion3" onChange={() => { }} options={mockOptions} />);
        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('opcion3');
    });

    it('debe estar deshabilitado cuando disabled=true', () => {
        render(<Select value="" onChange={() => { }} options={mockOptions} disabled />);
        const select = screen.getByRole('combobox');
        expect(select).toBeDisabled();
    });

    it('debe aceptar className adicional y aplicarlo al select', () => {
        render(<Select value="" onChange={() => { }} options={mockOptions} className="extra-class" />);
        const select = screen.getByRole('combobox');
        expect(select.className).toContain('extra-class');
    });

    it('debe renderizar el ícono de flecha (HiChevronDown)', () => {
        const { container } = render(<Select value="" onChange={() => { }} options={mockOptions} />);
        const icon = container.querySelector('svg.w-5.h-5') as SVGElement;
        expect(icon).toBeInTheDocument();
        expect(screen.getByRole('combobox').parentElement).toContainElement(icon);
    });
});
