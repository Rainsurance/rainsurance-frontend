import Layout from '@/layout/Layout';
import {
  EnvForm,
  GridItem,
  ItemForm,
  Checkbox,
  Txt,
  ButtonForm,
} from '../styles/stake';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createUseFormSchema = z.object({
  name: z.string().nonempty('Name is required'),
  lifetime: z.string().nonempty('Lifetime is required'),
  stakedamount: z.string().nonempty('Staked amount is required'),
  openuntil: z
    .date()
    .optional()
    .refine((date) => date != null, {
      message: 'Open until is required',
    }),
  minimumprotected: z.string().nonempty('Minimum protected amount is required'),
  maximumprotected: z.string().nonempty('Maximum protected amount is required'),
  minimumcoverage: z.string().nonempty('Minimum coverage duration is required'),
  maximumcoverage: z.string().nonempty('Maximum coverage duration is required'),
  anualpercentage: z.string().nonempty('Anual percentage return is required'),
  destination: z.string().nonempty('Destination city is required'),
  accept: z.boolean().refine((value) => value === true, {
    message: 'You need to accept the terms and conditions.',
  }),
});

const StakeView = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(createUseFormSchema),
  });
  function createUser(data) {
    console.log(data);
  }

  // datepicker
  const [startDate, setStartDate] = useState(null);
  const handleDateChange = (date) => {
    setStartDate(date);
  };
  // datepicker

  return (
    <Layout title="Stake">
      <EnvForm>
        <h2>
        <span>Create a new risk bundle</span>
        </h2>
        <form onSubmit={handleSubmit(createUser)}>
          <GridItem>
            <ItemForm>
              <label>
                NAME
                <input type="text" placeholder="Risk bundle name" {...register('name')} />
              </label>
              {errors.name && <span>{errors.name.message}</span>}
            </ItemForm>
            <ItemForm>
              <label>
                STAKED AMOUNT
                <input
                  type="number"
                  placeholder="USD 0,00"
                  {...register('stakedamount')}
                />
              </label>
              {errors.stakedamount && (
                <span>{errors.stakedamount.message}</span>
              )}
            </ItemForm>
            <ItemForm>
              <label>
                LIFETIME
                <input type="number" {...register('lifetime')} />
                <Txt>Days</Txt>
              </label>
              {errors.lifetime && <span>{errors.lifetime.message}</span>}
            </ItemForm>
            <ItemForm>
              <label>
                OPEN UNTIL
                <Controller
                  control={control}
                  name="openuntil"
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
              {errors.openuntil && <span>{errors.openuntil.message}</span>}
            </ItemForm>
            <ItemForm>
              <label>
                MINIMUM PROTECTED AMOUNT
                <input
                  type="number"
                  placeholder="USD 0,00"
                  {...register('minimumprotected')}
                />
              </label>
              {errors.minimumprotected && (
                <span>{errors.minimumprotected.message}</span>
              )}
            </ItemForm>
            <ItemForm>
              <label>
                MAXIMUM PROTECTED AMOUNT
                <input
                  type="number"
                  placeholder="USD 0,00"
                  {...register('maximumprotected')}
                />
              </label>
              {errors.maximumprotected && (
                <span>{errors.maximumprotected.message}</span>
              )}
            </ItemForm>
            <ItemForm>
              <label>
                MINIMUM COVERAGE DURATION
                <input type="number" {...register('minimumcoverage')} />
                <Txt>Days</Txt>
              </label>
              {errors.minimumcoverage && (
                <span>{errors.minimumcoverage.message}</span>
              )}
            </ItemForm>
            <ItemForm>
              <label>
                MAXIMUM COVERAGE DURATION
                <input type="number" {...register('maximumcoverage')} />
                <Txt>Days</Txt>
              </label>
              {errors.maximumcoverage && (
                <span>{errors.maximumcoverage.message}</span>
              )}
            </ItemForm>
            <ItemForm>
              <label>
                ANUAL PERCENTAGE RETURN
                <input type="number" {...register('anualpercentage')} />
                <Txt>%</Txt>
              </label>
              {errors.anualpercentage && (
                <span>{errors.anualpercentage.message}</span>
              )}
            </ItemForm>
            <ItemForm>
              <label>Destination</label>
              <select name="" {...register('destination')}>
                <option value="" hidden>
                  Select Destination
                </option>
                <option value="sp">São Paulo</option>
                <option value="rj">Rio de janeiro</option>
              </select>
              {errors.destination && <span>{errors.destination.message}</span>}
            </ItemForm>
          </GridItem>
          <Checkbox>
            <label>
              <input type="checkbox" name="" {...register('accept')} />
              By checking this box, I confirm that I have read and agree to the Terms of service.
            </label>
            {errors.accept && <span>{errors.accept.message}</span>}
          </Checkbox>
          <ButtonForm type="submit">Stake</ButtonForm>
        </form>
      </EnvForm>
    </Layout>
  );
};
export default StakeView;
