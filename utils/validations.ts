import {object,string} from 'yup'

export const signUpSchema = object({
  name:string().trim().required().label('Full Name'),
  email:string().trim().required().label('Email'),
  password:string().trim().required().label('Password')
})


export const signInSchema = object({
  email:string().trim().required().label('Email'),
  password:string().trim().required().label('Password')
})