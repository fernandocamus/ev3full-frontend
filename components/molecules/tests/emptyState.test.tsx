import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmptyState from '../emptyState';

vi.mock('../atoms/button', () => ({
  default: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('EmptyState', () => {
  it('debe renderizar el icono', () => {
    render(<EmptyState icon={<span>🌟</span>} title="Sin datos" />);
    expect(screen.getByText('🌟')).toBeInTheDocument();
  });

  it('debe renderizar el título correctamente', () => {
    render(<EmptyState icon={<span />} title="No hay registros" />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('No hay registros');
  });

  it('debe renderizar la descripción cuando se pasa como prop', () => {
    render(
      <EmptyState
        icon={<span />}
        title="Vacío"
        description="No se encontraron elementos"
      />
    );
    expect(screen.getByText('No se encontraron elementos')).toBeInTheDocument();
  });

  it('no debe renderizar la descripción cuando no se pasa', () => {
    render(<EmptyState icon={<span />} title="Vacío" />);
    expect(screen.queryByText(/No se encontraron elementos/i)).toBeNull();
  });

  it('debe renderizar el botón de acción cuando se pasa la prop action', () => {
    const handleClick = vi.fn();
    render(
      <EmptyState
        icon={<span />}
        title="Acción disponible"
        action={{ label: 'Agregar', onClick: handleClick }}
      />
    );
    const button = screen.getByRole('button', { name: 'Agregar' });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no debe renderizar el botón de acción cuando no se pasa la prop action', () => {
    render(<EmptyState icon={<span />} title="Sin acción" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('debe aceptar className adicional y aplicarlo al contenedor', () => {
    render(<EmptyState icon={<span />} title="Con clase" className="extra-class" />);
    const container = screen.getByText('Con clase').closest('div');
    expect(container?.className).toContain('extra-class');
  });
});
