import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ConfirmDialog from '../confirmDialog';

vi.mock('../atoms/button', () => ({
    default: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    ),
}));

describe('ConfirmDialog', () => {
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    const defaultProps = {
        isOpen: true,
        onClose: mockOnClose,
        onConfirm: mockOnConfirm,
        title: 'Confirmar acción',
        message: '¿Estás seguro de continuar?',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('no debe renderizar nada cuando isOpen=false', () => {
        render(<ConfirmDialog {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Confirmar acción')).toBeNull();
    });

    it('debe renderizar el título y mensaje correctamente', () => {
        render(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByText('Confirmar acción')).toBeInTheDocument();
        expect(screen.getByText('¿Estás seguro de continuar?')).toBeInTheDocument();
    });

    it('debe renderizar los botones con textos por defecto', () => {
        render(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
        expect(screen.getByText('Confirmar')).toBeInTheDocument();
    });

    it('debe renderizar los botones con textos personalizados', () => {
        render(
            <ConfirmDialog
                {...defaultProps}
                confirmText="Sí"
                cancelText="No"
            />
        );
        expect(screen.getByText('Sí')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('debe llamar a onClose cuando se hace click en el botón cancelar', () => {
        render(<ConfirmDialog {...defaultProps} />);
        fireEvent.click(screen.getByText('Cancelar'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('debe llamar a onConfirm cuando se hace click en el botón confirmar', () => {
        render(<ConfirmDialog {...defaultProps} />);
        fireEvent.click(screen.getByText('Confirmar'));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('debe llamar a onClose cuando se hace click en el fondo (overlay)', () => {
        render(<ConfirmDialog {...defaultProps} />);
        const overlay = document.querySelector('.bg-black\\/50') as HTMLElement;
        fireEvent.click(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('no debe llamar a onClose al hacer click en el fondo si loading=true', () => {
        render(<ConfirmDialog {...defaultProps} loading />);
        const overlay = document.querySelector('.bg-black\\/50') as HTMLElement;
        fireEvent.click(overlay);
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('debe deshabilitar los botones cuando loading=true', () => {
        render(<ConfirmDialog {...defaultProps} loading />);
        expect(screen.getByText('Cancelar')).toBeDisabled();
        expect(screen.getByText('Confirmar')).toBeDisabled();
    });

    it('debe llamar a onClose cuando se presiona Escape y loading=false', () => {
        render(<ConfirmDialog {...defaultProps} />);
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('no debe llamar a onClose cuando se presiona Escape y loading=true', () => {
        render(<ConfirmDialog {...defaultProps} loading />);
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});