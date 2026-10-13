import type { TableBlock } from '@/content/types'

export function TableBlockView({ block }: { block: TableBlock }) {
  return (
    <section className="block block-table">
      {block.title ? <h2>{block.title}</h2> : null}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {block.headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell, index) => (
                  <td key={`${cell}-${index}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
