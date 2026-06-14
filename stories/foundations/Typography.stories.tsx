import type { Meta, StoryObj } from '@storybook/react';

const typeScale = [
  { name: 'Display', token: '--text-display', sample: 'Headline Display 30/700' },
  { name: 'H1', token: '--text-h1', sample: 'Heading 1 — 24/600' },
  { name: 'H2', token: '--text-h2', sample: 'Heading 2 — 20/600' },
  { name: 'H3', token: '--text-h3', sample: 'Heading 3 — 16/600' },
  { name: 'Body', token: '--text-body', sample: 'Body text untuk paragraf. The quick brown fox jumps over the lazy dog. 16/400' },
  { name: 'Small', token: '--text-small', sample: 'Small text untuk label dan keterangan — 14/400' },
  { name: 'Caption', token: '--text-caption', sample: 'CAPTION TEXT — 12/500' },
];

const fontFamilies = [
  { name: 'UI Font', token: '--font-family', preview: 'Plus Jakarta Sans' },
  { name: 'Display Font', token: '--font-display', preview: 'Fraunces (Serif)' },
  { name: 'Mono Font', token: '--font-mono', preview: 'ui-monospace, SF Mono' },
];

const TypographyShowcase = () => (
  <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: 'var(--font-family)' }}>
    <h1 style={{ font: 'var(--text-display)', color: 'var(--ciamik-ink)', marginBottom: 8 }}>
      Typography
    </h1>
    <p style={{ font: 'var(--text-body)', color: 'var(--ciamik-text-secondary)', marginBottom: 32 }}>
      Ciamik UI menggunakan Plus Jakarta Sans sebagai font utama, Fraunces untuk display heading,
      dan system monospace untuk data tabular.
    </p>

    {/* Font Family Table */}
    <h2 style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)', marginBottom: 16 }}>
      Font Families
    </h2>
    <div style={{
      display: 'grid', gridTemplateColumns: '140px 1fr 1fr',
      gap: 0, border: '1px solid var(--ciamik-border-faint)', borderRadius: 'var(--r-lg)',
      overflow: 'hidden', marginBottom: 40,
    }}>
      {/* Header */}
      {['Name', 'Token', 'Preview'].map((h) => (
        <div key={h} style={{
          padding: '10px 16px', font: 'var(--text-caption)',
          color: 'var(--ciamik-text-secondary)', backgroundColor: 'var(--ciamik-bg)',
          fontWeight: 600, borderBottom: '1px solid var(--ciamik-border-faint)',
        }}>
          {h}
        </div>
      ))}
      {fontFamilies.map((f) => (
        <>
          <div key={`${f.name}-name`} style={{ padding: '12px 16px', font: 'var(--text-small)', color: 'var(--ciamik-ink)', fontWeight: 600, borderBottom: '1px solid var(--ciamik-border-faint)' }}>
            {f.name}
          </div>
          <div key={`${f.name}-token`} style={{ padding: '12px 16px', font: 'var(--text-caption)', fontFamily: 'var(--font-mono)', color: 'var(--ciamik-text-secondary)', borderBottom: '1px solid var(--ciamik-border-faint)' }}>
            {f.token}
          </div>
          <div key={`${f.name}-preview`} style={{ padding: '12px 16px', fontFamily: `var(${f.token})`, color: 'var(--ciamik-ink)', borderBottom: '1px solid var(--ciamik-border-faint)' }}>
            {f.preview}
          </div>
        </>
      ))}
    </div>

    {/* Type Scale */}
    <h2 style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)', marginBottom: 16 }}>
      Type Scale
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {typeScale.map((t) => (
        <div key={t.name} style={{
          display: 'grid', gridTemplateColumns: '100px 180px 1fr',
          alignItems: 'center', gap: 16, padding: '16px 0',
          borderBottom: '1px solid var(--ciamik-border-faint)',
        }}>
          <span style={{
            font: 'var(--text-caption)', color: 'var(--ciamik-primary)',
            fontWeight: 700, textTransform: 'uppercase',
          }}>
            {t.name}
          </span>
          <code style={{
            font: 'var(--text-caption)', fontFamily: 'var(--font-mono)',
            color: 'var(--ciamik-text-secondary)',
          }}>
            {t.token}
          </code>
          <span style={{ font: `var(${t.token})`, color: 'var(--ciamik-ink)' }}>
            {t.sample}
          </span>
        </div>
      ))}
    </div>

    {/* Tabular Nums */}
    <h3 style={{ font: 'var(--text-h3)', color: 'var(--ciamik-ink)', marginTop: 40, marginBottom: 12 }}>
      Tabular Numbers
    </h3>
    <p style={{ font: 'var(--text-small)', color: 'var(--ciamik-text-secondary)', marginBottom: 12 }}>
      Gunakan class <code>.tabnum</code> untuk angka yang sejajar dalam kolom (harga, tabel).
    </p>
    <div style={{ display: 'flex', gap: 32 }}>
      <div>
        <p style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)', marginBottom: 4 }}>Default</p>
        <div style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)' }}>
          <div>Rp 1.234.567</div>
          <div>Rp    89.012</div>
          <div>Rp   345.678</div>
        </div>
      </div>
      <div>
        <p style={{ font: 'var(--text-caption)', color: 'var(--ciamik-text-tertiary)', marginBottom: 4 }}>Tabular (.tabnum)</p>
        <div className="tabnum" style={{ font: 'var(--text-h2)', color: 'var(--ciamik-ink)' }}>
          <div>Rp 1.234.567</div>
          <div>Rp    89.012</div>
          <div>Rp   345.678</div>
        </div>
      </div>
    </div>
  </div>
);

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const TypeScale: Story = {
  render: () => <TypographyShowcase />,
};
