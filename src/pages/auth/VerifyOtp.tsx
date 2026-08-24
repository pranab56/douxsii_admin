import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getFromLocalStorage } from '../../utils/localStorage';
import AuthLayout from '../../components/layout/AuthLayout';
import { useForgotEmailOTPCheckMutation, useResendPasswordMutation } from '../../features/auth/authApi';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const [verifyOtp, { isLoading }] = useForgotEmailOTPCheckMutation();
    const [resendOtp, { isLoading: isResending }] = useResendPasswordMutation();

    const rawEmail = getFromLocalStorage("email");
    let userEmail = "";
    if (rawEmail) {
        try {
            userEmail = JSON.parse(rawEmail);
        } catch {
            userEmail = rawEmail;
        }
    }

    const handleResendEmail = async () => {
        const forgetToken = getFromLocalStorage("forgetToken");
        try {
            const res = await resendOtp({
                token: forgetToken,
                data: { email: userEmail },
            }).unwrap();

            Swal.fire({
                title: "OTP Resent",
                text: res.message || res.data?.message || `A new code has been sent to ${userEmail || 'your email'}`,
                icon: "success",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Resend Failed",
                text: err?.data?.message || err?.message || "Failed to resend OTP code.",
            });
        }
    };

    const onFinish = async (values: { otp: string }) => {
        const forgetToken = getFromLocalStorage("forgetToken");
        try {
            const res = await verifyOtp({
                token: forgetToken,
                data: { otp: values.otp },
            }).unwrap();

            if (res?.success) {
                Swal.fire({
                    text: res.message || res.data?.message || "OTP Verified Successfully",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1200,
                }).then(() => {
                    navigate("/new-password");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Invalid OTP",
                    text: res?.message || "Verification failed.",
                });
            }
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Verification Failed",
                text: err?.data?.message || err?.message || "Invalid OTP code. Please try again.",
            });
        }
    };

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4">Verify Code</h1>
                <p className="text-sm text-[#b7868b] leading-relaxed max-w-[340px] mx-auto">
                    An Authentication code has been sent to <br />
                    <span className="text-white font-medium">{userEmail || "your email"}</span>
                </p>
            </div>

            <Form name="verify_otp" layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="otp"
                    label={<span className="text-white text-sm font-semibold">Enter Code<span className="text-red-400 ml-0.5">*</span></span>}
                    rules={[
                        { required: true, message: 'Please input 6-digit verification code!' },
                        { len: 6, message: 'Verification code must be 6 digits!' }
                    ]}
                    className="mb-4"
                >
                    <div className='flex justify-center'>
                        <Input.OTP
                            length={6}
                            size="large"
                            className="otp-input-boxes w-full h-full"
                        />
                    </div>
                </Form.Item>

                <div className="text-sm flex items-center justify-start gap-1 mb-8 mt-3">
                    <span className="text-[#b7868b]">Didn't receive a code?</span>
                    <button
                        type="button"
                        disabled={isResending}
                        className="text-[#e57373] font-bold hover:underline flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0 bg-transparent outline-none"
                        onClick={handleResendEmail}
                    >
                        {isResending ? (
                            <>
                                <span className="w-3.5 h-3.5 border-2 border-[#e57373]/30 border-t-[#e57373] rounded-full animate-spin inline-block" />
                                Resending...
                            </>
                        ) : (
                            "Resend"
                        )}
                    </button>
                </div>

                <Form.Item className="mb-4">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        disabled={isLoading}
                        className="w-full text-base font-semibold h-11"
                        style={{ border: '1px solid #7d1522' }}
                    >
                        {isLoading ? 'Verifying...' : 'Next'}
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

export default VerifyOtp;
