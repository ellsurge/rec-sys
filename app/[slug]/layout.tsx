export default function PricingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex items-center justify-center flex-col gap-4 py-1 md:py-10">
			<div className="w-10/12 justify-center">
				{children}
			</div>
		</section>
	);
}
