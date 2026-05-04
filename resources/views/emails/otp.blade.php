<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>InvTrack OTP Verification</title>
</head>

<body
    style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="400"
                    style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #0d9488; padding: 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">InvTrack</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <h2 style="color: #1f2937; margin-bottom: 10px;">Verification Code</h2>
                            <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">
                                A login attempt was made for your InvTrack account. Please use the verification code
                                below to proceed:
                            </p>

                            <div style="margin: 30px 0;">
                                <span
                                    style="background-color: #f3f4f6; border: 1px dashed #0d9488; color: #0d9488; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 15px 30px; border-radius: 4px; display: inline-block;">
                                    {{ $otp }}
                                </span>
                            </div>

                            <p style="color: #ef4444; font-size: 13px; font-weight: 500;">
                                This code will expire in 10 minutes.
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td
                            style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                If you did not attempt to log in, please ignore this email or update your password for
                                security purposes.
                            </p>
                            <p style="color: #9ca3af; font-size: 12px; margin-top: 10px;">
                                &copy; {{ date('Y') }} InvTrack Inventory System
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
