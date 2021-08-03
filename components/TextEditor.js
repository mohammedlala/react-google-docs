import { EditorState } from 'draft-js';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { db } from '../firebase';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { convertFromRaw, convertToRaw } from 'draft-js';
const Editor = dynamic(
	() => import('react-draft-wysiwyg').then((module) => module.Editor),
	{
		ssr: false,
	},
);

function TextEditor() {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [session] = useSession();
	const router = useRouter();

	const [snapshot] = useDocumentOnce(
		db
			.collection('userDocs')
			.doc(session.user.email)
			.collection('docs')
			.doc(router.query.id),
	);

	useEffect(() => {
		if (snapshot?.data()?.editorState) {
			setEditorState(
				EditorState.createWithContent(
					convertFromRaw(snapshot?.data()?.editorState),
				),
			);
		}
	}, [snapshot]);

	const onEditorStateChange = (editorState) => {
		setEditorState(editorState);
		db.collection('userDocs')
			.doc(session.user.email)
			.collection('docs')
			.doc(router.query.id)
			.set(
				{
					editorState: convertToRaw(editorState.getCurrentContent()),
				},
				{
					merge: true,
				},
			);
	};

	return (
		<div className='bg-[#F8F9FA] min-h-screen pb-16'>
			<Editor
				editorState={editorState}
				onEditorStateChange={onEditorStateChange}
				toolbarClassName='flex sticky top-0 z-50 !justify-center mx-auto'
				editorClassName='mt-6 p-10 bg-white shadow-lg max-w-5xl mx-auto mb-12 border'
			/>
		</div>
	);
}

export default TextEditor;
