import {
  EnvForm,
  ItemForm,     
  ButtonForm } from "./styles";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

const createUseFormSchema = z.object({
 destination: z.string().nonempty('Destination city is required'),
 arrivalDate: z
 .date()  
 .optional()  
 .refine((date) => date != null, {
   message: "Arrival date is required",
 }),
 ndays: z.string().nonempty('The number of days is required'),
 amount: z.string().nonempty('Coverege amount is required'),   
})

const FormCalculate = ({ setModalOpen }) => {    
 const {register, handleSubmit, formState:{errors}, control} = useForm({
   resolver: zodResolver(createUseFormSchema)
 })     
 function createUser(data){
   console.log(data)
   setModalOpen(true);     
 }     
 
 // datepicker
 const [startDate, setStartDate] = useState(null);
 const handleDateChange = (date) => {
   setStartDate(date);
 };
 // datepicker   

 return (
  
   <EnvForm>
   <h2>Lorem ipsum <br />
   <span>dolor sit amet</span></h2>
   <form onSubmit={handleSubmit(createUser)}>
   <ItemForm>
      <label>Destination</label>           
      <select name="" {...register('destination')}>
        <option value="" hidden>Select Destination</option>
        <option value="sp">São Paulo</option>
        <option value="rj">Rio de janeiro</option>
      </select>
      {errors.destination &&  <span>{errors.destination.message}</span>}
   </ItemForm>
   <ItemForm>
      <label>
        Arrival date
        <Controller
          control={control}
          name="arrivalDate"
          render={({ field }) => (
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                field.onChange(date);
                handleDateChange(date);
              }}
              placeholderText="mm/dd/aaaa"
              dateFormat="MM/dd/yyyy"
            />
          )}
        />               
      </label>
      {errors.arrivalDate && <span>{errors.arrivalDate.message}</span>}
    </ItemForm>
    <ItemForm>
      <label>              
      Number of days
      <input type="number" {...register('ndays')}/>                
      </label>     
      {errors.ndays &&  <span>{errors.ndays.message}</span>}
    </ItemForm>  
    <ItemForm>
      <label>              
      Coverage amount (usd)
      <input type="number" placeholder="USD 0,00" {...register('amount')}/>  
      </label>  
      {errors.amount &&  <span>{errors.amount.message}</span>}   
    </ItemForm> 
    <ItemForm>
      <ButtonForm type="submit">Calculate Premium</ButtonForm>              
    </ItemForm>
    </form>
</EnvForm>       
 );
};

export default FormCalculate;
