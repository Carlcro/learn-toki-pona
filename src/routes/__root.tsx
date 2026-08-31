import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "lean toki pona",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<div
					style={{ display: "contents" }}
					dangerouslySetInnerHTML={{
						__html: `<!--
IMPECCABLE DIRECTION CONTRACT (redesign, roll seed bd58a4bd)
THESIS: Progress feels like a cozy pouch of collected trinkets on a glowing night sky, never a stern instrument readout.
OWN-WORLD: Deep indigo-navy ground with soft lavender (#d7b0fe) and pink (#febcd5) glow; rounded-[32px] cards, pill-shaped rows with circular letter badges, chunky rounded-full gummy buttons with a pressable color ledge. Baloo 2 for numerals/headings/buttons, Quicksand for body/labels, Caveat script for the wordmark and small celebratory lines.
STORY: A returning learner sees how many of ~137 words they've collected and how many are due today in one glance, then taps one big pink pill to keep going.
FIRST VIEWPORT: A centered cozy card on a glowing navy ground — a light lavender-to-pink count-pod ("N/137"), a divider, a row of gem dots for due reviews, a big pink pill action button beneath.
FORM: User- and brief-pinned world (reference screenshot + pinned palette) overriding the assigned roll (direction 5 of 7, seed bd58a4bd), per "a user- or brief-pinned decision beats the roll, always."
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md.
-->`,
					}}
				/>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
