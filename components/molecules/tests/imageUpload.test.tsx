import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import ImageUpload from '../imageUpload';

describe('ImageUpload', () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('debe renderizar el botón de subir imagen cuando no hay preview', () => {
        render(<ImageUpload onChange={mockOnChange} />);
        expect(screen.getByText('Subir imagen')).toBeInTheDocument();

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('debe renderizar la imagen de preview cuando se pasa la prop preview', () => {
        render(<ImageUpload onChange={mockOnChange} preview="preview-url" />);
        const img = screen.getByAltText('Preview');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'preview-url');
    });

    it('debe mostrar error si se sube un archivo que no es imagen', () => {
        const { container } = render(<ImageUpload onChange={mockOnChange} />);

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        const file = new File(['contenido'], 'documento.pdf', { type: 'application/pdf' });

        fireEvent.change(input, { target: { files: [file] } });

        expect(screen.getByText('Pruebe con otra imagen')).toBeInTheDocument();
        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('debe llamar a onChange con el archivo cuando se sube una imagen válida', () => {
        const { container } = render(<ImageUpload onChange={mockOnChange} />);

        const input = container.querySelector('input[type="file"]') as HTMLInputElement;
        const file = new File(['contenido'], 'foto.png', { type: 'image/png' });

        fireEvent.change(input, { target: { files: [file] } });

        expect(mockOnChange).toHaveBeenCalledWith(file);
    });

    it('debe limpiar el preview y llamar a onChange(null) al eliminar la imagen', () => {
        render(<ImageUpload onChange={mockOnChange} preview="preview-url" />);
        const removeButton = screen.getByRole('button');
        fireEvent.click(removeButton);
        expect(mockOnChange).toHaveBeenCalledWith(null);
        expect(screen.queryByAltText('Preview')).toBeNull();
    });

    it('debe aceptar className adicional y aplicarlo al contenedor', () => {
        const { container } = render(<ImageUpload onChange={mockOnChange} className="extra-class" />);

        const rootElement = container.firstChild as HTMLElement;
        expect(rootElement.className).toContain('extra-class');
    });
});