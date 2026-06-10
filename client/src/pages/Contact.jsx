import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { contactSchema } from '../schemas/contact';
import { sendContactMessage } from '../api/client';

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = async (values) => {
    try {
      const data = await sendContactMessage(values);
      toast.success(data.message || 'Message sent!');
      reset();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="contact">
      <h1>Contact us</h1>
      <p className="contact__intro">
        Questions about the demo? Send us a note and we&apos;ll get back to you.
      </p>

      <form
        className="contact__form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <label className="field">
          <span>Name</span>
          <input className="input" type="text" {...register('name')} />
          {errors.name && (
            <small className="field__error">{errors.name.message}</small>
          )}
        </label>

        <label className="field">
          <span>Email</span>
          <input className="input" type="email" {...register('email')} />
          {errors.email && (
            <small className="field__error">{errors.email.message}</small>
          )}
        </label>

        <label className="field">
          <span>Message</span>
          <textarea className="input" rows={5} {...register('message')} />
          {errors.message && (
            <small className="field__error">{errors.message.message}</small>
          )}
        </label>

        <button
          type="submit"
          className="btn btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  );
}
