import TextEditor from '../../components/TextEditor';
import Button from '@material-tailwind/react/Button';
import Icon from '@material-tailwind/react/Icon';
import { useRouter } from 'next/dist/client/router';
import { getSession, signOut, useSession } from 'next-auth/client';
import Login from '../../components/Login';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
import { db } from '../../firebase';

function Doc() {
	const [session] = useSession();
	if (!session) return <Login />;
	const router = useRouter();
	const { id } = router.query;
	const [snapshot, loadingSnapshot] = useCollectionOnce(
		db
			.collection('userDocs')
			.doc(session.user.email)
			.collection('docs')
			.doc(id),
	);

	if (!loadingSnapshot && !snapshot?.data().fileName) {
		router.replace('/');
	}

	return (
		<div>
			<header className='flex justify-between items-center p-3 pb-1'>
				<span className='cursor-pointer' onClick={() => router.push('/')}>
					<Icon name='description' size='5xl' color='blue' />
				</span>
				<div className='flex-grow px-2'>
					<h2>{snapshot?.data().fileName}</h2>
					<div className='flex items-center text-sm space-x-1 -ml-1 h-8 text-gray-600'>
						{['File', 'Edit', 'View', 'Insert', 'Format', 'Tools'].map(
							(data) => (
								<p className='cursor-pointer hover:bg-gray-100 transition duration-200 ease-out p-2 rounded-lg'>
									{data}
								</p>
							),
						)}
					</div>
				</div>
				<Button
					color='blue'
					buttonType='filled'
					size='regular'
					className='h-10'
					rounded={false}
					block={false}
					iconOnly={false}
					ripple='light'
				>
					<Icon name='people' size='md' />
					SHARE
				</Button>
				<img
					className='cursor-pointer rounded-full h-10 w-10 ml-2'
					src={session.user.image}
					alt=''
					onClick={signOut}
				/>
			</header>
			<TextEditor />
		</div>
	);
}

export default Doc;

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: {
			session,
		},
	};
}
