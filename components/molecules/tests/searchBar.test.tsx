import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import SearchBar from '../searchBar';

vi.mock('../atoms/input', () => ({
    default: ({ value, onChange, placeholder, onKeyPress }: any) => (
        <input
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
        />
    ),
}));

vi.mock('../atoms/select', () => ({
    default: ({ value, onChange, options }: any) => (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    ),
}));

vi.mock('../atoms/button', () => ({
    default: ({ children, onClick, disabled }: any) => (
        <button onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),
}));

describe('SearchBar', () => {
    const handleSearchChange = vi.fn();
    const handleFilterChange = vi.fn();
    const handleSearch = vi.fn();

    beforeEach(() => {
        handleSearchChange.mockClear();
        handleFilterChange.mockClear();
        handleSearch.mockClear();
    });

    it('debe renderizar el input con el valor y placeholder correctos', () => {
        render(
            <SearchBar
                searchValue="test"
                onSearchChange={handleSearchChange}
                placeholder="Buscar producto"
            />
        );
        const input = screen.getByPlaceholderText('Buscar producto');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('test');
    });

    it('debe llamar a onSearchChange cuando cambia el valor del input', () => {
        render(<SearchBar searchValue="" onSearchChange={handleSearchChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'nuevo valor' } });
        expect(handleSearchChange).toHaveBeenCalledWith('nuevo valor');
    });

    it('debe llamar a onSearch cuando se presiona Enter en el input', () => {
        render(<SearchBar searchValue="" onSearchChange={handleSearchChange} onSearch={handleSearch} />);
        const input = screen.getByRole('textbox');
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(handleSearch).toHaveBeenCalledTimes(1);
    });

    it('debe renderizar el select cuando se pasan filterOptions y onFilterChange', () => {
        const options = [
            { value: 'opt1', label: 'Opción 1' },
            { value: 'opt2', label: 'Opción 2' },
        ];
        render(
            <SearchBar
                searchValue=""
                onSearchChange={handleSearchChange}
                filterValue="opt1"
                onFilterChange={handleFilterChange}
                filterOptions={options}
            />
        );
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue('opt1');
    });

    it('debe llamar a onFilterChange cuando cambia el valor del select', () => {
        const options = [
            { value: 'opt1', label: 'Opción 1' },
            { value: 'opt2', label: 'Opción 2' },
        ];
        render(
            <SearchBar
                searchValue=""
                onSearchChange={handleSearchChange}
                filterValue="opt1"
                onFilterChange={handleFilterChange}
                filterOptions={options}
            />
        );
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'opt2' } });
        expect(handleFilterChange).toHaveBeenCalledWith('opt2');
    });

    it('debe renderizar el botón de búsqueda cuando se pasa onSearch', () => {
        render(<SearchBar searchValue="" onSearchChange={handleSearchChange} onSearch={handleSearch} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('debe llamar a onSearch cuando se hace click en el botón de búsqueda', () => {
        render(<SearchBar searchValue="" onSearchChange={handleSearchChange} onSearch={handleSearch} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(handleSearch).toHaveBeenCalledTimes(1);
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(<SearchBar searchValue="" onSearchChange={handleSearchChange} className="extra-class" />);
        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});