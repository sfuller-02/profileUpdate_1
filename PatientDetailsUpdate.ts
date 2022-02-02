import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { resourceLimits } from 'worker_threads';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    /* Pre-Load Properties */
    PatientDetails: Profile;

    /* Properties for the profile form */
    updatePatientProfileForm: FormGroup;
    id: FormControl;
    firstName: FormControl;
    lastName: FormControl;
    email: FormControl;
    paymentMethod: FormControl;
    insuranceProvider: FormControl;

    age: FormControl;
    gender: FormControl;
    height: FormControl;
    weight: FormControl;
    bmi: FormControl;
    medicalConditions: FormControl;
    phone: FormControl;
    emergencyContact: FormControl;


    constructor(private fb: FormBuilder, private acct: PatientDetails) {}

    ngOnInit(): void {
        this.loadUserProfile();
        window.scroll(0, 0);
    }

    onSubmit() {
        if (this.updateProfileForm.valid) {
            this.isProfileLoaded = false;
            let userDetails = this.updateProfileForm.value;
            userDetails.country = this.ProfileDetails.billingAddress.country;
            userDetails.scountry = this.ProfileDetails.shippingAddress.country;
            userDetails.gender =
                this.ProfileDetails.gender == 'null' || this.ProfileDetails.gender == '' ? 'Prefer Not To Say' : this.ProfileDetails.gender;

            Swal.fire({
                title: 'Enter your password',
                input: 'password',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Update Profile',
                showLoaderOnConfirm: true,
                preConfirm: (password) => {
                    userDetails.password = password;
                    this.acct.updateProfile(userDetails).subscribe((result) => {
                        this.toastr.success(result.message);
                        this.acct.clearCache();
                        this.loadUserProfile();
                        this.isProfileLoaded = true;
                    });
                }
            }).then((result) => {
                if (result.dismiss) {
                    this.isProfileLoaded = true;
                }
            });
        } else {
            this.errorList = [];
            const controls = this.updateProfileForm.controls;

            for (let name in controls) {
                if (controls[name].invalid) {
                    let errorDescription = '';
                    if (controls[name].hasError('required')) {
                        switch (name) {
                            case 'isTermsAccepted':
                                errorDescription = 'acceptance of Term is required';
                                this.errorList.push(errorDescription);
                                break;
                            case 'sscity':
                                errorDescription = 'shipping city is required';
                                this.errorList.push(errorDescription);
                                break;
                            case 'sstate':
                                errorDescription = 'shipping state is required';
                                this.errorList.push(errorDescription);
                                break;
                            case 'saddress1':
                                errorDescription = 'shipping address line 1 is required';
                                this.errorList.push(errorDescription);
                                break;
                            case 'scity':
                                errorDescription = 'shipping city is required';
                                this.errorList.push(errorDescription);
                                break;
                            case 'spostalcode':
                                errorDescription = 'shipping postalcode is required';
                                this.errorList.push(errorDescription);
                                break;
                            default:
                                errorDescription = name + ' is required';
                                this.errorList.push(errorDescription);
                                break;
                        }
                    } else {
                        errorDescription = 'Please review ' + name;
                        this.errorList.push(errorDescription);
                    }
                    controls[name].markAsTouched();
                }
            }
            console.log(this.errorList);
            this.showErrorModal();
        }
    }

            this.PatientDetails = {
                id: result.id,
                firstName: result.firstName;
                lastName: result.lastName;
                email: result.email;
                paymentMethod: result.paymentMethod;
                insuranceProvider: result.insuranceProvider;
                age: result.age;
                gender: result.gender;
                height: result.height;
                weight: result.weight;
                bmi: result.bmi;
                medicalConditions: result.medicalConditions;
                phone: result.phone;
                emergencyContact: result.emergencyContact;
            };

            this.createFormGroup();

            this.isProfileLoaded = true;

            // console.log(this.ProfileDetails);
        });
    }

    createFormGroup() {
        this.id = new FormControl(this.PatientDetails.id, [Validators.required]);
        this.firstName = new FormControl(this.PatientDetails.firstName, [Validators.required, Validators.maxLength(15), Validators.minLength(2)]);
        this.lastName = new FormControl(this.PatientDetails.lastName, [Validators.required, Validators.maxLength(15), Validators.minLength(2)]);
        this.email = new FormControl(this.PatientDetails.email, [Validators.required, Validators.email]);
        this.paymentMethod = new FormControl(this.PatientDetails.paymentMethod, [Validators.required]);
        this.insuranceProvider = new FormControl(this.PatientDetails.insuranceProvider, [Validators.required]);
        this.age = new FormControl(this.PatientDetails.age, [Validators.required]);
        this.gender = new FormControl(this.PatientDetails.gender, [Validators.required]);
        this.height = new FormControl(this.PatientDetails.height, [Validators.required]);
        this.weight = new FormControl(this.PatientDetails.weight, [Validators.required]);
        this.bmi = new FormControl(this.PatientDetails.bmi, [Validators.required]);
        this.medicalConditions = new FormControl(this.PatientDetails.medicalConditions, [Validators.required]);
        this.phone = new FormControl(this.PatientDetails.phone, [
            Validators.required,
            Validators.pattern('^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$')
        ]);
        this.emergencyContact = new FormControl(this.PatientDetails.emergencyContact, [Validators.required]);
        


        this.updateProfileForm = this.fb.group({
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            paymentMethod: this.paymentMethod,
            insuranceProvider: this.insuranceProvider,
            age: this.age,
            gender: this.gender,
            height: this.height,
            weight: this.weight,
            bmi: this.bmi,
            medicalConditions: this.medicalConditions,
            phone: this.phone,
            emergencyContact: this.emergencyContact
        });
    }

    editDob() {
        const $birthdate = $('#birthdate');

        $birthdate.removeAttr('disabled');
        $birthdate.datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: '1920:2099',
            onSelect: (dateText) => {
                this.birthdate.setValue(dateText);
            }
        });
    }

    editGender() {
        const $addGenderDropdown = $('#gender');

        $addGenderDropdown.removeAttr('disabled');
        let genderOptionsValues =
            '<option [ngValue]="' +
            this.ProfileDetails.gender +
            '" disabled selected>' +
            (this.ProfileDetails.gender == '' || this.ProfileDetails.gender == null)
                ? 'Select Gender'
                : this.ProfileDetails.gender + '</option>';
        this.genderValues.forEach((obj, index) => {
            genderOptionsValues += '<option [ngValue]="' + obj + '">' + obj + '</option>';
        });

        $addGenderDropdown.append(genderOptionsValues);
        $addGenderDropdown.chosen();
        $addGenderDropdown.chosen().on('change', (event) => {
            this.ProfileDetails.gender = $(event.target).val().toString();
            console.log(this.ProfileDetails.gender);
        });
    }