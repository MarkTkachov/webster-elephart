import { Img } from 'react-image';
import { signUpGoogle } from '../api/signUpGoogle';
import { useState, useEffect } from 'react';

const SignUpGoogle = () => {
    const [redirectUrl, setRedirectUrl] = useState('');

    const handleSignUp = async () => {
        const data = await signUpGoogle();
        if (data)
            setRedirectUrl(data);
    };

    useEffect(() => {
        if (redirectUrl)
            window.location.href = redirectUrl;
    }, [redirectUrl]);

    return (
        <button className=" mt-4 flex w-1/2  items-center justify-center gap-2 rounded-lg border bg-white p-[9px] text-sm text-black" onClick={handleSignUp}>
            <Img
                src="../src/public/google.svg"
                alt="My Image"
                loader={<div>Loading...</div>}
                unloader={<div>Failed to load image.</div>}
                className="h-6"
            />
            Sign up with google
        </button>
    );
};

export default SignUpGoogle;
