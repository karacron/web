import { Building2, CloudCog, HardDrive } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const productIcons = {
	local: HardDrive,
	teams: Building2,
	escalation: CloudCog,
} as const;

export async function FeatureProduct() {
	const t = await getTranslations('orchestration');
	const items = ['local', 'teams', 'escalation'] as const;

	return (
		<div
			id='orchestration'
			className='overflow-hidden bg-gray-900 py-16 sm:py-20'>
			<div className='mx-auto max-w-7xl px-6 lg:px-8'>
				<div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2'>
					<div className='lg:pt-4 lg:pr-8'>
						<div className='lg:max-w-lg'>
							<h2 className='text-base/7 font-semibold text-indigo-400'>
								{t('eyebrow')}
							</h2>
							<p className='mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl'>
								{t('title')}
							</p>
							<p className='mt-6 text-lg/8 text-gray-300'>
								{t('subtitle')}
							</p>
							<dl className='mt-10 max-w-xl space-y-8 text-base/7 text-gray-400 lg:max-w-none'>
								{items.map((item) => {
									const Icon = productIcons[item];

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
					<Image
						width={2432}
						height={1442}
						src='/chat.png'
						alt={t('imageAlt')}
						className='w-full max-w-xl rounded-xl shadow-xl ring-1 ring-white/10 sm:w-228 sm:max-w-none md:-ml-4 lg:ml-0'
					/>
				</div>
			</div>
		</div>
	);
}
