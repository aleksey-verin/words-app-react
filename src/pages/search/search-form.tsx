import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ClipboardCopy, SearchIcon } from 'lucide-react'
import { Word } from '@/data/types'

const formSchema = z.object({
  word: z.string().min(2).max(50),
})

async function requestWord(word: string) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  )
  const data = (await response.json()) as Word[]
  return data[0]
}

const SearchForm = ({
  setWord,
  setResult,
}: {
  setWord: (value: string) => void
  setResult: (value: Word | null) => void
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const value = values.word.trim()
    const result = await requestWord(value)
    if (result) {
      setResult(result)
      setWord(result.word)
    } else {
      setResult(null)
      setWord('No Definitions Found')
    }
    form.reset()
  }

  // const readClipboard = async (): Promise<string | undefined> => {
  //   if (!navigator.clipboard) {
  //     fallbackReadClipboard();
  //     return;
  //   }
  //   try {
  //     const text = await navigator.clipboard.readText()
  //     console.log('text', text);
  //     if (text) {
  //       return text
  //       // await onSubmit({ word: text })
  //     }
  //   } catch (err) {
  //     console.error('Failed to read clipboard: ', err)
  //   }
  // }

  // function fallbackReadClipboard(): string | undefined {
  //   try {
  //   console.log('fallback');
  //   const textarea = document.createElement("textarea");
  //   textarea.style.position = 'fixed';
  //   textarea.style.opacity = '0';
  //   document.body.appendChild(textarea);
  //   textarea.focus();
  //   textarea.select();
  //   document.execCommand('paste');
  //   document.body.removeChild(textarea);
  //   const text = textarea.value;
  //   console.log(text);
  //   return text
  //   } catch (err) {
  //     console.error('Fallback failed to read clipboard', err);
  //   }
  // }

  // const handlePaste = async () => {
  //   const text = await readClipboard();
  //   if (text) {
  //     form.setValue('word', text);
  //     onSubmit({ word: text });
  //   } else {
  //     console.log('no text found');
  //   }
  // };
  
    const handlePaste = async () => {
      const text = await navigator.clipboard.readText();
      console.log(text);
      if (text) {
        form.setValue('word', text);
        onSubmit({ word: text });
      }
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
        <FormField
          control={form.control}
          name='word'
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Username</FormLabel> */}
              <FormControl>
                <div className='flex items-center justify-between gap-2'>
                  <Input
                    type='search'
                    placeholder='Enter the word..'
                    {...field}
                    className='text-base h-10 rounded-full flex-auto'
                  />
                  <Button
                    size='sm'
                    variant='outline'
                    type='button'
                    className='flex items-center justify-center h-10 rounded-full px-2'
                    onClick={handlePaste}
                  >
                    <ClipboardCopy className='w-6 h-6 opacity-70' />
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    type='submit'
                    className='flex items-center justify-center h-10 rounded-full px-6'
                  >
                    <SearchIcon className='w-6 h-6 opacity-70' />
                  </Button>
                </div>
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage className='absolute left-0 text-xs top-9' />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default SearchForm
