from django.contrib.auth.forms import SetPasswordForm
from django.core.exceptions import ValidationError
from django import forms

class CustomSetPasswordForm(SetPasswordForm):

    error_messages = {
        'general_error': 'Something went wrong. Refresh the page ?',
        'password_mismatch': 'The two password fields didn’t match.',
        'password_less_characters': 'Password should contain atleast 8 characters',
    }

    new_password1 = forms.CharField(
        label="New password",
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        strip=False,
    )

    def clean_new_password2(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2:
            if password1 != password2:
                raise ValidationError(
                    self.error_messages['password_mismatch'],
                    code='password_mismatch',
                )
            if len(password1) < 8:
                raise ValidationError(
                    self.error_messages['password_less_characters'],
                    code='password_less_characters',
                )
        else:
            raise ValidationError(
                self.error_messages['general_error'],
                code='general_error',
            )

        return password2