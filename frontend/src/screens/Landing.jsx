import React, { useEffect, useRef } from "react";
import {
	ArrowRight,
	Sparkles,
	Shield,
	Zap,
	MessageSquare,
	Search,
	Database,
	BarChart3,
} from "lucide-react";

export default function Landing() {
	const subtitleRef = useRef(null);

	useEffect(() => {
		// Simple typewriter effect for subtitle
		const el = subtitleRef.current;
		if (!el) return;
		const text = "MRI Tumor Analysis Assistant";
		let i = 0;
		el.textContent = "";
		const type = () => {
			if (i <= text.length) {
				el.textContent = text.slice(0, i);
				i++;
				setTimeout(type, 40);
			}
		};
		type();
	}, []);

	const handleGetStarted = () => {
		window.location.href = "/signin";
	};
	const handleSignup = () => {
		window.location.href = "/signup";
	};

	return (
		<div className="min-h-screen bg-black text-white font-sans relative overflow-hidden selection:bg-white selection:text-black">
			{/* Subtle animated background */}
			<div className="absolute inset-0 pointer-events-none z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-white/5 via-black/0 to-white/5 animate-bgfade" />
				<div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float1" />
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-2xl animate-float2" />
				{/* White orbs for visual interest */}
				<div className="absolute top-24 left-16 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-orb1" />
				<div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/15 rounded-full blur-xl animate-orb2" />
				<div className="absolute bottom-24 right-32 w-28 h-28 bg-white/25 rounded-full blur-2xl animate-orb3" />
				<div className="absolute bottom-1/3 left-1/2 w-16 h-16 bg-white/10 rounded-full blur-lg animate-orb4" />
				<div className="absolute top-1/4 right-1/5 w-24 h-24 bg-white/20 rounded-full blur-xl animate-orb5" />
			</div>
			<style>
				{`
				@keyframes bgfade {
					0%,100% { opacity: 1; }
					50% { opacity: 0.7; }
				}
				.animate-bgfade { animation: bgfade 12s ease-in-out infinite; }
				@keyframes float1 {
					0%,100% { transform: translateY(0) scale(1);}
					50% { transform: translateY(30px) scale(1.05);}
				}
				@keyframes float2 {
					0%,100% { transform: translateY(0) scale(1);}
					50% { transform: translateY(-30px) scale(1.08);}
				}
				.animate-float1 { animation: float1 16s ease-in-out infinite; }
				.animate-float2 { animation: float2 18s ease-in-out infinite; }
				/* Orb animations */
				@keyframes orb1 {
					0%,100% { transform: translateY(0) scale(1);}
					50% { transform: translateY(-20px) scale(1.08);}
				}
				@keyframes orb2 {
					0%,100% { transform: translateX(0) scale(1);}
					50% { transform: translateX(18px) scale(1.04);}
				}
				@keyframes orb3 {
					0%,100% { transform: translateY(0) scale(1);}
					50% { transform: translateY(24px) scale(1.1);}
				}
				@keyframes orb4 {
					0%,100% { transform: translateX(0) scale(1);}
					50% { transform: translateX(-16px) scale(1.07);}
				}
				@keyframes orb5 {
					0%,100% { transform: translateY(0) scale(1);}
					50% { transform: translateY(-18px) scale(1.06);}
				}
				.animate-orb1 { animation: orb1 13s ease-in-out infinite; }
				.animate-orb2 { animation: orb2 15s ease-in-out infinite; }
				.animate-orb3 { animation: orb3 17s ease-in-out infinite; }
				.animate-orb4 { animation: orb4 14s ease-in-out infinite; }
				.animate-orb5 { animation: orb5 16s ease-in-out infinite; }
				@keyframes fadeInUp {
					from { opacity: 0; transform: translateY(40px);}
					to { opacity: 1; transform: translateY(0);}
				}
				.animate-fadeInUp { animation: fadeInUp 1.2s cubic-bezier(.4,0,.2,1) both; }
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				.animate-fadeIn { animation: fadeIn 1.2s cubic-bezier(.4,0,.2,1) both; }
				@keyframes pulseText {
					0%,100% { opacity: 1; }
					50% { opacity: 0.7; }
				}
				.animate-pulseText { animation: pulseText 2.5s infinite; }
				`}
			</style>

			{/* Navigation */}
			<nav className="mx-auto max-w-7xl px-6 py-8 relative z-10">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Sparkles className="h-8 w-8 text-white transition-transform duration-700 hover:rotate-12 drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)]" />
						<span className="text-2xl font-black tracking-widest uppercase font-mono drop-shadow-[0_2px_8px_rgba(255,255,255,0.08)]">
							MediCoin
						</span>
					</div>
					<div className="hidden md:flex items-center gap-8 text-base font-medium">
						{["features", "how", "advantages"].map((id) => (
							<a
								key={id}
								href={`#${id}`}
								className="nav-link relative px-2 py-1 text-gray-300 hover:text-white transition-colors duration-200"
							>
								<span className="capitalize">{id.replace(/-/g, " ")}</span>
								<span className="nav-underline" />
							</a>
						))}
					</div>
					<div className="flex items-center gap-3">
						<button
							className="px-5 py-2 rounded-lg text-gray-300 hover:text-white border border-white/10 hover:border-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 font-semibold tracking-wide"
							onClick={handleGetStarted}
						>
							Log in
						</button>
						<button
							className="px-5 py-2 rounded-lg text-white bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 font-semibold tracking-wide"
							onClick={handleSignup}
						>
							Create account
						</button>
					</div>
				</div>
				<style>
					{`
					.nav-link {
						overflow: hidden;
					}
					.nav-underline {
						display: block;
						position: absolute;
						left: 0; bottom: 0;
						width: 100%; height: 2px;
						background: linear-gradient(90deg, #fff 0%, #fff 100%);
						transform: scaleX(0);
						transform-origin: left;
						transition: transform 0.3s cubic-bezier(.4,0,.2,1);
					}
					.nav-link:hover .nav-underline {
						transform: scaleX(1);
					}
					`}
				</style>
			</nav>

			{/* Hero Section */}
			<div className="relative z-10">
				<div className="mx-auto max-w-7xl px-6 py-24 sm:py-36 flex flex-col items-center">
					<div className="max-w-3xl text-center">
						<div className="mb-8 mx-auto">
							<span className="inline-block px-6 py-2 rounded-full bg-white/10 text-sm font-semibold text-white/80 tracking-widest animate-fadeIn shadow-lg backdrop-blur-md">
								Assistive AI for Medical Imaging
							</span>
						</div>
						<h1 className="text-6xl sm:text-8xl font-black tracking-tight text-white pb-4 animate-fadeInUp leading-tight drop-shadow-[0_2px_16px_rgba(255,255,255,0.08)]">
							MediCoin
						</h1>
						<div className="h-12 mb-2">
							<span
								ref={subtitleRef}
								className="block text-2xl sm:text-3xl font-light tracking-wide text-white/70 animate-pulseText"
								style={{ minHeight: "2.5rem" }}
							>
								{/* Typewriter effect will fill this */}
							</span>
						</div>
						<p className="mt-8 text-xl sm:text-2xl leading-9 text-gray-200 font-light animate-fadeIn">
							<span className="block mb-2">
								Analyze MRI (DICOM) images with advanced AI models:
							</span>
							<ul className="list-disc list-inside text-lg text-gray-400 mt-4 mb-2 text-left mx-auto max-w-xl space-y-2">
								<li>
									<span className="font-semibold text-white">Segment tumors</span> – Detect and localize tumors in MRI scans.
								</li>
								<li>
									<span className="font-semibold text-white">Classify malignancy</span> – Predict if a tumor is <span className="text-white font-semibold">malignant</span> or <span className="text-white font-semibold">benign</span> with probability.
								</li>
							</ul>
							<span className="block mt-4 text-white/60">
								Upload MRI scans, get tumor segmentation, and receive a malignancy probability—fast, secure, and easy.
							</span>
						</p>
						<div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8">
							<button
								className="group relative w-full sm:w-auto px-10 py-5 rounded-xl bg-white text-black hover:bg-black hover:text-white border border-white transition-all duration-300 shadow-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 animate-fadeIn font-bold text-lg overflow-hidden ripple"
								onClick={handleGetStarted}
							>
								<span className="flex items-center justify-center gap-3">
									Sign in to start
									<ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
								</span>
							</button>
							<button
								className="group relative w-full sm:w-auto px-10 py-5 rounded-xl bg-black text-white hover:bg-white hover:text-black border border-white transition-all duration-300 shadow-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 animate-fadeIn font-bold text-lg overflow-hidden ripple"
								onClick={handleSignup}
							>
								<span className="flex items-center justify-center gap-3">
									Create account
								</span>
							</button>
						</div>
					</div>

					{/* Floating stats */}
					<div className="mt-28 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl mx-auto">
						{[
							{ label: "Segmentation accuracy", value: "99%" },
							{ label: "MRI image support", value: "DICOM" },
							{ label: "Classification with probability", value: "Malignant/Benign" },
						].map((stat, i) => (
							<div
								key={stat.label}
								className="stats-card bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center shadow-xl transition-transform duration-300 hover:scale-105 animate-fadeIn border border-white/10"
								style={{ animationDelay: `${0.1 + i * 0.1}s` }}
							>
								<h3 className="text-4xl font-extrabold text-white mb-2">{stat.value}</h3>
								<p className="text-gray-300 text-lg">{stat.label}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* How does it work section */}
			<div id="how" className="relative mx-auto max-w-4xl px-6 py-24 z-10">
				<div className="text-center mb-14">
					<h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white pb-4 animate-slide-up">
						How does it work?
					</h2>
				</div>
				<div className="text-xl text-gray-200 leading-9 space-y-8 font-light animate-fade-in">
					<p>
						<strong className="font-bold text-white">Segmentation:</strong> We use a custom UNet-based deep learning model, trained ethically on MRI images provided by doctors, to accurately detect and localize tumors in DICOM scans.
					</p>
					<p>
						<strong className="font-bold text-white">Classification:</strong> For malignancy prediction, we select only those MRI images that contain the ovary. We then use a VGG19 neural network, trained on biopsy-verified malignant and benign samples, to classify the tumor and provide a malignancy probability.
					</p>
					<p>
						All data used for training was collected with proper consent and ethical standards, ensuring privacy and reliability.
					</p>
				</div>
			</div>

			{/* Features section */}
			<div id="features" className="relative mx-auto max-w-7xl px-6 py-36 z-10">
				<div className="text-center mb-24">
					<h2 className="text-5xl font-extrabold tracking-tight text-white pb-6 animate-slide-up">
						How MediCoin Works
					</h2>
					<p className="mt-6 text-2xl text-gray-300 max-w-2xl mx-auto font-light">
						Upload MRI scans, get tumor segmentation, and receive malignancy predictions—all in one place.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-3">
					{[
						{ icon: <Database className="h-7 w-7 text-white" />, title: "DICOM MRI Upload", desc: "Securely upload MRI images in DICOM format. Our system is built for medical-grade privacy and compliance." },
						{ icon: <Search className="h-7 w-7 text-white" />, title: "Tumor Segmentation", desc: "Our AI model detects and localizes tumors in MRI scans, providing clear segmentation overlays for easy review." },
						{ icon: <BarChart3 className="h-7 w-7 text-white" />, title: "Malignancy Classification", desc: "After segmentation, a classification model predicts whether the tumor is malignant or benign, with a probability score." },
						{ icon: <Shield className="h-7 w-7 text-white" />, title: "Privacy & Security", desc: "All data is encrypted and processed securely. MediCoin is designed for healthcare compliance and confidentiality." },
						{ icon: <MessageSquare className="h-7 w-7 text-white" />, title: "Assistive Reports", desc: "Receive easy-to-understand reports and visualizations to support clinical decisions and patient communication." },
						{ icon: <Zap className="h-7 w-7 text-white" />, title: "Fast & Reliable", desc: "Get results in seconds. Our cloud-based AI models are optimized for speed and reliability." },
					].map((f, i) => (
						<div
							key={f.title}
							className="feature-card group bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10 transition-transform duration-300 hover:scale-105 animate-fade-in"
							style={{ animationDelay: `${0.1 + i * 0.1}s` }}
						>
							<div className="flex items-center gap-5 mb-7">
								<div className="p-5 rounded-full bg-black/20 shadow-inner">
									{f.icon}
								</div>
								<h3 className="text-2xl font-semibold text-white">{f.title}</h3>
							</div>
							<p className="text-gray-300 text-lg font-light">{f.desc}</p>
						</div>
					))}
				</div>
			</div>

			{/* Advantages section */}
			<div id="advantages" className="relative mx-auto max-w-4xl px-6 py-24 z-10">
				<div className="text-center mb-14">
					<h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white pb-4 animate-slide-up">
						Advantages of MediCoin
					</h2>
				</div>
				<ul className="list-disc list-inside text-2xl text-gray-300 space-y-5 font-light animate-fade-in">
					<li>
						<strong className="font-bold text-white">Ethically trained AI:</strong> Uses real, consented medical data for trustworthy results.
					</li>
					<li>
						<strong className="font-bold text-white">Specialized for ovarian MRI:</strong> Focuses on relevant images for higher accuracy.
					</li>
					<li>
						<strong className="font-bold text-white">End-to-end workflow:</strong> From upload to segmentation to malignancy prediction, all in one place.
					</li>
					<li>
						<strong className="font-bold text-white">Fast and secure:</strong> Results in seconds, with privacy and compliance built-in.
					</li>
					<li>
						<strong className="font-bold text-white">Assistive, not replacement:</strong> Designed to support doctors and medical staff in decision making.
					</li>
				</ul>
			</div>

			{/* CTA section */}
			<div className="relative z-10">
				<div className="mx-auto max-w-7xl px-6 py-36">
					<div className="text-center">
						<h2 className="text-5xl font-extrabold tracking-tight text-white animate-slide-up">
							Empower your medical team with AI
						</h2>
						<p className="mt-8 text-2xl leading-9 text-gray-200 max-w-3xl mx-auto font-light">
							Join doctors and medical professionals using MediCoin to improve diagnostic accuracy and workflow efficiency.
						</p>
						<div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8">
							<button
								className="w-full sm:w-auto px-10 py-5 rounded-xl bg-white text-black hover:bg-black hover:text-white border border-white transition-all duration-300 font-bold text-lg shadow-2xl ripple"
								onClick={handleGetStarted}
							>
								Sign in to start
							</button>
							<button
								className="w-full sm:w-auto px-10 py-5 rounded-xl bg-black text-white border border-white hover:bg-white hover:text-black transition-all duration-300 font-bold text-lg shadow-2xl ripple"
								onClick={handleSignup}
							>
								Create account
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Animations and Ripple */}
			<style>
				{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes slideDown {
					from { opacity: 0; transform: translateY(-40px);}
					to { opacity: 1; transform: translateY(0);}
				}
				@keyframes slideUp {
					from { opacity: 0; transform: translateY(40px);}
					to { opacity: 1; transform: translateY(0);}
				}
				.animate-fade-in { animation: fadeIn 1.2s cubic-bezier(.4,0,.2,1) both; }
				.animate-slide-down { animation: slideDown 1.2s cubic-bezier(.4,0,.2,1) both; }
				.animate-slide-up { animation: slideUp 1.2s cubic-bezier(.4,0,.2,1) both; }
				.ripple {
					position: relative;
					overflow: hidden;
				}
				.ripple:after {
					content: "";
					position: absolute;
					left: 50%; top: 50%;
					width: 0; height: 0;
					background: rgba(255,255,255,0.25);
					border-radius: 100%;
					transform: translate(-50%, -50%);
					opacity: 0;
					transition: width 0.5s, height 0.5s, opacity 0.5s;
					pointer-events: none;
				}
				.ripple:active:after {
					width: 300px; height: 300px;
					opacity: 0.2;
					transition: 0s;
				}
				`}
			</style>
		</div>
	);
}
