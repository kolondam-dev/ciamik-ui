import type { Meta, StoryObj } from '@storybook/react';

const spacingScale = [
  { name: 'xs', token: '--space-xs', value: '4px' },
  { name: 'sm', token: '--space-sm', value: '8px' },
  { name: 'md', token: '--space-md', value: '16px' },
  { name: 'lg', token: '--space-lg', value: '24px' },
  { name: 'xl', token: '--space-xl', value: '32px' },
  { name: '2xl', token: '--space-2xl', value: '48px' },
];

const radiusScale = [
  { name: 'xs', token: '--r-xs', value: '2px', use: 'Detail kecil, inner element' },
  { name: 'sm', token: '--r-sm', value: '4px', use: 'Badge persegi, tag' },
  { name: 'md', token: '--r-md', value: '6px', use: 'Button, input, select (DEFAULT kontrol)' },
  { name: 'lg', token: '--r-lg', value: '10px', use: 'Card, panel (DEFAULT surface)' },
  { name: 'xl', token: '--r-xl', value: '14px', use: 'Modal, sheet, drawer' },
  { name: 'pill', token: '--r-pill', value: '999px', use: 'Chip, badge-pill, avatar' },
];

const elevationScale = [
  { name: 'none', token: '--sh-none' },
  { name: 'sm', token: '--sh-sm' },
  { name: 'md', token: '--sh-md' },
  { name: 'lg', token: '--sh-lg' },
  { name: 'up', token: '--sh-up' },
];

const SpacingShowcase = () => (
  <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: 'var(--font-family)' }}>
    <h1 style={{ font: 'var(--text-display)', color: 'var(--ciamik-ink)', marginBottom: 8 }}>
      Spacing, Radius & Elevation
    </h1>
    <p style={{ font: 'var(--text-body)', color: 'var(--ciamik-text-secondary)', marginBottom: 32 }}>
      Skala spacing berbasis 8px, radius bertingkat untuk kontrol vs surface, dan shadow dengan navy tint.
    </p>

    {/* Spacing Scale */}
    <h2 style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)', marginBottom: 16 }}>
      Spacing Scale (base 8px)
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
      {spacingScale.map((s) => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <code style={{
            font: 'var(--text-caption)', fontFamily: 'var(--font-mono)',
            color: 'var(--ciamik-text-secondary)', width: 120, flexShrink: 0,
          }}>
            {s.token}
          </code>
          <span style={{
            font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)',
            width: 40, textAlign: 'right', flexShrink: 0,
          }}>
            {s.value}
          </span>
          <div style={{
            width: `var(${s.token})`, height: 24,
            backgroundColor: 'var(--ciamik-primary)',
            borderRadius: 'var(--r-xs)', opacity: 0.7,
            minWidth: 4, transition: 'width var(--dur-base) var(--ease)',
          }} />
        </div>
      ))}
    </div>

    <hr style={{ border: 'none', borderTop: '1px solid var(--ciamik-border-faint)', margin: '32px 0' }} />

    {/* Radius Scale */}
    <h2 style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)', marginBottom: 16 }}>
      Border Radius Scale
    </h2>
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 40 }}>
      {radiusScale.map((r) => (
        <div key={r.name} style={{ textAlign: 'center', width: 100 }}>
          <div style={{
            width: 80, height: 80,
            backgroundColor: 'var(--ciamik-primary)',
            borderRadius: `var(${r.token})`,
            margin: '0 auto', opacity: 0.85,
          }} />
          <div style={{ font: 'var(--text-caption)', fontWeight: 700, color: 'var(--ciamik-ink)', marginTop: 8 }}>
            {r.name}
          </div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)', fontSize: 10 }}>
            {r.value}
          </div>
          <div style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)', fontSize: 10, marginTop: 2 }}>
            {r.use}
          </div>
        </div>
      ))}
    </div>

    <hr style={{ border: 'none', borderTop: '1px solid var(--ciamik-border-faint)', margin: '32px 0' }} />

    {/* Elevation Scale */}
    <h2 style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)', marginBottom: 16 }}>
      Elevation (Shadow)
    </h2>
    <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)', marginBottom: 24 }}>
      Tint: navy-800 rgba(27,38,79,…) — bukan hitam murni. Flat-first design.
    </p>
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {elevationScale.map((e) => (
        <div key={e.name} style={{ textAlign: 'center' }}>
          <div style={{
            width: 120, height: 80,
            backgroundColor: 'var(--ciamik-surface)',
            borderRadius: 'var(--r-lg)',
            boxShadow: `var(${e.token})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: e.name === 'none' ? '1px solid var(--ciamik-border-faint)' : 'none',
          }}>
            <span style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-secondary)' }}>
              {e.name}
            </span>
          </div>
          <code style={{
            font: 'var(--text-caption)', fontFamily: 'var(--font-mono)',
            color: 'var(--ciamik-text-tertiary)', fontSize: 10, marginTop: 8, display: 'block',
          }}>
            {e.token}
          </code>
        </div>
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Foundations/Spacing & Elevation',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const Overview: Story = {
  render: () => <SpacingShowcase />,
};
