export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex items-center justify-center gap-4 py-10 md:py-5">
			<div className="w-5/5 md:w-3/5 inline-block  text-center justify-center">
				{children}
			</div>
		</section>
	);
}
