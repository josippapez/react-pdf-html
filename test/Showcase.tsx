import React from "react";
import {
  Circle,
  ClipPath,
  Defs,
  Document,
  Ellipse,
  G,
  Image,
  Line,
  LinearGradient,
  Link,
  Note,
  Page,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Text,
  Tspan,
  View,
} from "../src/index";

// A two-page CV that uses every component this package exports.
const avatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACI0lEQVR4nO3VR24bMBSE4TlOzpQzBem9x7333rud3nsOMTeYQAsCgmDZkjXkW9CLb//PW5A4+UfVDMd/qZrh6A9VMxz+pmqGg19UzbD/k6oZ9n5QNcPud6pm2PlG1QzbX6maYesLVTNsfqZqho1PVM2w/pEq5crVax0r1YS1D1Ru3QxvlbsNq++pnHoZn+Tsw8o7KhfH+CRXI5bfUjk4xyc5OrH0hnLLMT5xt2LxNeWUc3zi7MXCCeVU4gDOXswfUy4lxieuZswdUS4lD+Bqxuwh5VLyAK5mzBxQLiUP4GrG9D7lUvIArmZM7VEuJQ/gasbkLuVS8gCuZkzsUC4lD+Bqxvg25VLyAK5mjG1RLiUP4GrG6CblUvIArmaMbFBOJcY7ezG8TjmVOICzF0NrlFvO8e5WDK5SOeQYn6MTAytULs7xuRrRv0zl5Bifsw99S5RbzjfA3YpXi5RLiR8gcTXj5QLVq5LDW/Xajhfz1EVFDm910Q14Pkd1K3rsWbrdgmezVDeiB3aimz14OkN1KnpYNzrdhCfT1Hmix/TivG14PEWdJXqAw1n78GiSaic63KndRjycoNqJjnZqtxEPxqnTRAfncNpO3B+jWkWH5tS6FfdGqWbRgSU078XdEapZdFwJzXtxZ5hKosNKSptxe4hKoqNKSptxa5BqiA6K0NiNmwNUQ3RMhMZu3Oivc3yC632VHyA6INrlAaIDol0eIDog2n8Ch2GLKBMw/wAAAABJRU5ErkJggg==";

const accent = "#2a5a8c";

const styles = {
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#222" },
  sidebar: {
    width: 170,
    backgroundColor: "#eef2f7",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  main: { flex: 1, paddingHorizontal: 24, paddingVertical: 20 },
  heading: {
    fontSize: 12,
    fontWeight: "semibold" as const,
    color: accent,
    marginBottom: 6,
    textTransform: "uppercase" as const,
  },
  section: { marginBottom: 14 },
  chip: {
    backgroundColor: "#dbe4ef",
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  row: { flexDirection: "row" as const },
};

const skills = [
  ["TypeScript", 0.9],
  ["React", 0.85],
  ["Node.js", 0.7],
  ["SQL", 0.6],
] as const;

const jobs = [
  {
    role: "Senior frontend engineer",
    company: "Acme Studio",
    period: "2021 - now",
    points: ["Led the design system rewrite.", "Cut bundle size by 38%."],
  },
  {
    role: "Frontend engineer",
    company: "Northwind",
    period: "2018 - 2021",
    points: ["Built the invoicing app.", "Mentored four juniors."],
  },
];

const Logo = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48">
    <Defs>
      <LinearGradient id="logoFill" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#4f8fd6" />
        <Stop offset="100%" stopColor={accent} />
      </LinearGradient>
      <RadialGradient id="logoGlow" cx="0.5" cy="0.5" r="0.5">
        <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
        <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
      </RadialGradient>
      <ClipPath id="logoClip">
        <Circle cx={24} cy={24} r={22} />
      </ClipPath>
    </Defs>
    <G clipPath="url(#logoClip)">
      <Rect x={0} y={0} width={48} height={48} fill="url(#logoFill)" />
      <Ellipse cx={16} cy={14} rx={14} ry={10} fill="url(#logoGlow)" />
    </G>
    <Path
      d="M14 34 L24 12 L34 34 Z"
      fill="none"
      stroke="#ffffff"
      strokeWidth={3}
    />
  </Svg>
);

const SkillBar = ({ name, level }: { name: string; level: number }) => (
  <View style={{ marginBottom: 6 }}>
    <Text style={{ marginBottom: 2 }}>{name}</Text>
    <Svg width={138} height={6}>
      <Rect x={0} y={0} width={138} height={6} rx={3} fill="#cfd9e6" />
      <Rect x={0} y={0} width={138 * level} height={6} rx={3} fill={accent} />
    </Svg>
  </View>
);

const Chart = () => (
  <Svg width={300} height={110} viewBox="0 0 300 110">
    <Line x1={30} y1={90} x2={290} y2={90} stroke="#999" strokeWidth={1} />
    <Line x1={30} y1={10} x2={30} y2={90} stroke="#999" strokeWidth={1} />
    <Polyline
      points="30,80 80,64 130,70 180,40 230,30 280,14"
      fill="none"
      stroke={accent}
      strokeWidth={2}
    />
    <Polygon points="280,8 286,20 274,20" fill="#d9822b" />
    <Text x={34} y={104} fill="#555" style={{ fontSize: 8 }}>
      <Tspan>2019</Tspan>
    </Text>
    <Text x={252} y={104} fill="#555" style={{ fontSize: 8 }}>
      <Tspan>2025</Tspan>
    </Text>
  </Svg>
);

export const Showcase = ({ highlight = false }: { highlight?: boolean }) => (
  <Document title="Ana Horvat CV" author="Ana Horvat">
    <Page size="A4" style={[styles.page, styles.row]}>
      <View style={styles.sidebar}>
        <Image
          src={avatar}
          style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 12 }}
        />
        <View style={styles.section}>
          <Text style={styles.heading}>Contact</Text>
          <Text>Zagreb, Croatia</Text>
          <Link src="mailto:ana@example.com" style={{ color: accent }}>
            ana@example.com
          </Link>
          <Link href="https://example.com" style={{ color: accent }}>
            example.com
          </Link>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Skills</Text>
          {skills.map(([name, level]) => (
            <SkillBar key={name} name={name} level={level} />
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Tools</Text>
          <View style={[styles.row, { flexWrap: "wrap" }]}>
            {["Vite", "Figma", "Docker", "Git", "pnpm"].map((tool) => (
              <Text key={tool} style={styles.chip}>
                {tool}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.main}>
        <View style={[styles.row, { alignItems: "center", marginBottom: 16 }]}>
          <Logo />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>Ana Horvat</Text>
            <Text style={{ fontSize: 12, color: "#555" }}>
              Frontend engineer
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Profile</Text>
          <Text style={{ lineHeight: 1.4 }}>
            I build <Text style={{ fontWeight: "bold" }}>fast</Text>,{" "}
            <Text style={{ fontStyle: "italic" }}>accessible</Text> web apps.
            See my work at{" "}
            <Link src="https://example.com/portfolio" style={{ color: accent }}>
              example.com/portfolio
            </Link>
            .
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Experience</Text>
          {jobs.map((job, index) => (
            <View
              key={job.company}
              style={[
                { marginBottom: 8, paddingLeft: 8, borderLeftWidth: 2 },
                [{ borderLeftColor: "#cfd9e6" }],
                highlight && index === 0
                  ? { borderLeftColor: "#d9822b" }
                  : undefined,
              ]}
            >
              <View style={[styles.row, { justifyContent: "space-between" }]}>
                <Text style={{ fontWeight: "bold" }}>
                  {job.role}{" "}
                  <Text style={{ color: accent }}>@ {job.company}</Text>
                </Text>
                <Text style={{ color: "#777" }}>{job.period}</Text>
              </View>
              {job.points.map((point) => (
                <Text key={point} style={{ marginTop: 2 }}>
                  - {point}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Growth</Text>
          <Chart />
        </View>
        <Note>Reviewed in October</Note>
      </View>
    </Page>

    <Page size="A4" style={[styles.page, { padding: 40 }]}>
      <Text style={styles.heading}>Projects</Text>
      {["Design system", "Invoice builder", "PDF previewer"].map(
        (name, index) => (
          <View
            key={name}
            style={[
              styles.row,
              { paddingVertical: 6, paddingHorizontal: 8 },
              index % 2 === 0 ? { backgroundColor: "#f3f6fa" } : undefined,
            ]}
          >
            <Text style={{ width: 140, fontWeight: "bold" }}>{name}</Text>
            <Text style={{ flex: 1 }}>
              Shipped in {2020 + index}, used by {(index + 1) * 1200} people.
            </Text>
          </View>
        ),
      )}
    </Page>
  </Document>
);
