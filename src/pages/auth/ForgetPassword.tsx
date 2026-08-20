import { Button, Form } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { setToLocalStorage } from '../../utils/localStorage';
import { FormInput } from '../../components/ui/FormInput';
import AuthLayout from '../../components/layout/AuthLayout';
import { useForgotEmailMutation } from '../../features/auth/authApi';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [forgotEmail, { isLoading }] = useForgotEmailMutation();

    const onFinish = async (values: { email: string }) => {
        try {
            const res = await forgotEmail({ email: values.email }).unwrap();
            if (res?.success) {
                const forgetToken = res.data?.forgetToken;
                if (forgetToken) {
                    setToLocalStorage("forgetToken", forgetToken);
                }
                setToLocalStorage("email", values.email);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Verification Email Sent",
                    text: res.message || res.data?.message || "Please check your inbox for the OTP code.",
                    timer: 1200,
                    showConfirmButton: false,
                }).then(() => {
                    navigate('/verify-otp');
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: res?.message || "Failed to send verification code.",
                });
            }
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: err?.data?.message || err?.message || "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4">Forgot your password?</h1>
                <p className="text-sm text-[#b7868b] leading-relaxed max-w-[360px] mx-auto">
                    Enter the email address associated with your account. We'll send you an verification code to your email.
                </p>
            </div>

            <Form name="forget_password" layout="vertical" onFinish={onFinish}>
                <FormInput
                    name="email"
                    label={<span className="text-white text-sm font-semibold">Email<span className="text-red-400 ml-0.5">*</span></span>}
                    placeholder="Enter your email"
                    type="text"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email address!' }]}
                />

                <Form.Item className="mb-4 mt-6">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="w-full text-base font-semibold"
                        style={{ border: '1px solid #7d1522' }}
                    >
                        Send Verification Code
                    </Button>
                </Form.Item>

                <div className="text-center mt-6">
                    <Link to="/login" className="text-white text-sm hover:underline hover:text-gray-200">
                        Back to login
                    </Link>
                </div>
            </Form>
        </AuthLayout>
    );
};

export default ForgetPassword;
