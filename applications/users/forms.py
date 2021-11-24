from applications.users.models import User
from django import forms
from django.contrib.auth import authenticate


class LoginForm(forms.Form):
    """Form definition for Login."""
    email = forms.EmailField(
        label='E-mail',
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'id_email',
            'onblur': 'validation()'
        })
    )
        
    password = forms.CharField(
        label='Contraseña',
        required=True,
        widget=forms.PasswordInput()
    )
    
    def clean(self):
        cleaned_data = super(LoginForm, self).clean()
        email = self.cleaned_data['email']
        password = self.cleaned_data['password']
        
        if not authenticate(email=email, password=password):
            raise forms.ValidationError('Los datos de usuario no son correctos')
        
        return self.cleaned_data


class RegistroForm(forms.ModelForm):
    """ Form for user creation """
    email = forms.EmailField(
        label='Correo',
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'new_email',
            'onblur': 'validation()'
        })
    )
    
    password1 = forms.CharField(
        label='Contraseña',
        required=True,
        widget=forms.PasswordInput(attrs={
            'class': 'pass1'
        })
    )
    
    password2 = forms.CharField(
        label='Repetir Contraseña',
        required=True,
        widget=forms.PasswordInput(attrs={
            'class': 'pass2',
            'onblur': 'check_password()'
        })
    )
    
    def clean_password2(self):
        password1 = self.cleaned_data['password1']
        password2 = self.cleaned_data['password2']
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError('Las contraseñas no coinciden')
        return password2
    
    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user
    
    class Meta:
        model = User
        fields = [
            'email',
            'password1',
            'password2'
        ]