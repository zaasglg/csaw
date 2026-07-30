type MeshPoint = {
  x: number
  y: number
}

const columnCount = 23
const rowCount = 13

function terrainHeight(x: number, row: number) {
  const rollingWave =
    Math.sin(x / 112 + row * 0.22) * (20 + row * 0.8) +
    Math.sin(x / 238 - row * 0.12) * 18
  const westernPeak = -92 * Math.exp(-Math.pow((x - 330) / 230, 2))
  const centralPeak = -124 * Math.exp(-Math.pow((x - 815) / 270, 2))
  const easternPeak = -108 * Math.exp(-Math.pow((x - 1280) / 250, 2))

  return 402 + row * 38 + rollingWave + westernPeak + centralPeak + easternPeak
}

const terrainRows: MeshPoint[][] = Array.from({ length: rowCount }, (_, row) =>
  Array.from({ length: columnCount }, (_, column) => {
    const x = -100 + column * (1800 / (columnCount - 1))

    return {
      x,
      y: terrainHeight(x, row),
    }
  }),
)

const particles = [
  [5, 16, 3, "lavender"],
  [11, 37, 5, "lavender"],
  [16, 9, 2, "navy"],
  [22, 25, 3, "gold"],
  [28, 14, 4, "lavender"],
  [34, 42, 2, "navy"],
  [40, 7, 3, "lavender"],
  [47, 29, 5, "lavender"],
  [54, 17, 2, "gold"],
  [61, 8, 4, "lavender"],
  [67, 39, 3, "navy"],
  [73, 21, 3, "lavender"],
  [79, 12, 5, "lavender"],
  [85, 32, 2, "gold"],
  [92, 19, 3, "lavender"],
  [96, 46, 4, "lavender"],
  [8, 63, 2, "navy"],
  [19, 72, 3, "lavender"],
  [32, 57, 2, "gold"],
  [45, 76, 4, "lavender"],
  [58, 61, 3, "navy"],
  [70, 70, 2, "lavender"],
  [83, 59, 3, "gold"],
  [90, 80, 2, "lavender"],
] as const

function pointsAttribute(points: MeshPoint[]) {
  return points.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
}

export function FixedMeshBackground() {
  return (
    <div className="fixed-mesh-background" aria-hidden="true">
      <div className="fixed-mesh-glow" />

      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          <linearGradient id="meshLavender" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d9ccff" stopOpacity="0.22" />
            <stop offset="0.24" stopColor="#a980ff" stopOpacity="0.82" />
            <stop offset="0.58" stopColor="#b99cff" stopOpacity="0.74" />
            <stop offset="0.84" stopColor="#9f78f4" stopOpacity="0.62" />
            <stop offset="1" stopColor="#d9ccff" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="meshSecondary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a980ff" stopOpacity="0.58" />
            <stop offset="0.62" stopColor="#8da9c4" stopOpacity="0.28" />
            <stop offset="1" stopColor="#d4af37" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="meshFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset="0.18" stopColor="white" stopOpacity="0.72" />
            <stop offset="0.42" stopColor="white" stopOpacity="1" />
            <stop offset="0.9" stopColor="white" stopOpacity="0.64" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="terrainFade">
            <rect width="1600" height="900" fill="url(#meshFade)" />
          </mask>
          <g
            id="terrainTopology"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          >
            <g stroke="url(#meshLavender)" strokeWidth="1.05">
              {terrainRows.map((points, row) => (
                <polyline key={`ridge-${row}`} points={pointsAttribute(points)} />
              ))}
            </g>

            <g stroke="url(#meshSecondary)" strokeWidth="0.82">
              {Array.from({ length: columnCount }, (_, column) => (
                <polyline
                  key={`thread-${column}`}
                  points={pointsAttribute(
                    terrainRows.map((points) => points[column]),
                  )}
                />
              ))}

              {terrainRows.slice(0, -1).flatMap((points, row) =>
                points.slice(0, -1).map((point, column) => {
                  const nextPoint =
                    terrainRows[row + 1][
                      (row + column) % 2 === 0 ? column + 1 : column
                    ]
                  const oppositePoint =
                    (row + column) % 2 === 0
                      ? terrainRows[row + 1][column]
                      : points[column + 1]

                  return (
                    <line
                      key={`facet-${row}-${column}`}
                      x1={oppositePoint.x}
                      y1={oppositePoint.y}
                      x2={nextPoint.x}
                      y2={nextPoint.y}
                    />
                  )
                }),
              )}
            </g>
          </g>
        </defs>

        <g mask="url(#terrainFade)">
          <g transform="translate(0 -76)">
            <use
              href="#terrainTopology"
              className="mesh-wave-layer mesh-wave-layer--rear"
            />
          </g>
          <use
            href="#terrainTopology"
            className="mesh-wave-layer mesh-wave-layer--main"
          />
          <g transform="translate(0 72)">
            <use
              href="#terrainTopology"
              className="mesh-wave-layer mesh-wave-layer--front"
            />
          </g>
        </g>
      </svg>

      <div className="fixed-mesh-particles">
        {particles.map(([left, top, size, tone]) => (
          <span
            key={`${left}-${top}`}
            className={`fixed-mesh-particle fixed-mesh-particle--${tone}`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
            }}
          />
        ))}
      </div>
    </div>
  )
}
