import { CalendarCheck, Mic, Video } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const contentIcons = {
	voice: Mic,
	tasks: CalendarCheck,
	media: Video,
} as const;

export async function FeatureContent() {
	const t = await getTranslations('featureContent');
	const items = ['voice', 'tasks', 'media'] as const;

	return (
		<div
			id='feature-content'
			className='bg-gray-900 py-16 sm:py-20'>
			<div className='mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-12'>
					{/* Imagen a la izquierda en desktop, arriba en mobile */}
					<div className='order-1 lg:order-0 flex items-center justify-center'>
						<Image
							width={2432}
							height={1442}
							src='/dashboard.png'
							alt={t('imageAlt')}
							className='w-full max-w-xl rounded-xl shadow-xl ring-1 ring-white/10 sm:w-228 sm:max-w-none md:-ml-4 lg:ml-0'
							priority
						/>
					</div>
					{/* Contenido a la derecha en desktop */}
					<div className='lg:pl-12 flex flex-col justify-center'>
						<h2 className='text-base/7 font-semibold text-indigo-400 mb-2'>
							{t('eyebrow')}
						</h2>
						<p className='text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl mb-4'>
							{t('title')}
						</p>
						<p className='mb-8 text-lg/8 text-gray-300'>
							{t('subtitle')}
						</p>
						<dl className='space-y-8 text-base/7 text-gray-400'>
							{items.map((item) => {
								const Icon = contentIcons[item];
								return (
									<div
										key={item}
										className='relative pl-12'>
										<Icon
											aria-hidden='true'
											className='absolute top-1 left-0 size-5 text-indigo-400'
										/>
										<dt className='inline font-semibold text-white'>
											{t(`items.${item}.title`)}
										</dt>
										<dd className='inline'>
											{' '}
											{t(`items.${item}.description`)}
										</dd>
									</div>
								);
							})}
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
}
