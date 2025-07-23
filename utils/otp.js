export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const otpExpiry = () => {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5); // OTP valid for 10 minutes
    return expires;
};