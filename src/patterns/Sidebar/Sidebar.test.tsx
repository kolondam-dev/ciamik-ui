import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar, SidebarGroup } from './Sidebar';
import { House } from '@phosphor-icons/react';

const groups: SidebarGroup[] = [
  {
    title: 'Menu Utama',
    items: [
      { key: 'home', label: 'Beranda', icon: <House data-testid="icon-home" />, isActive: true },
    ],
  },
];

describe('Sidebar', () => {
  it('renders menu items and group titles when expanded', () => {
    render(
      <Sidebar
        isCollapsed={false}
        onCollapseToggle={() => {}}
        groups={groups}
        logo="CIAMIK"
      />
    );

    expect(screen.getByText('Menu Utama')).toBeInTheDocument();
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
  });

  it('hides labels and group titles when collapsed', () => {
    render(
      <Sidebar
        isCollapsed={true}
        onCollapseToggle={() => {}}
        groups={groups}
      />
    );

    expect(screen.queryByText('Menu Utama')).not.toBeInTheDocument();
    expect(screen.queryByText('Beranda')).not.toBeInTheDocument();
    expect(screen.getByTestId('icon-home')).toBeInTheDocument(); // icon remains
  });

  it('triggers collapse toggle callback', () => {
    const onToggle = vi.fn();
    render(
      <Sidebar
        isCollapsed={false}
        onCollapseToggle={onToggle}
        groups={groups}
      />
    );

    const toggleBtn = screen.getByTestId('sidebar-toggle-btn');
    fireEvent.click(toggleBtn);
    expect(onToggle).toHaveBeenCalled();
  });
});
