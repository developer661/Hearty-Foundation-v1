import { supabase } from './supabase';

const DOCUMENT_BUCKET = 'registration-documents';
const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export const assertValidRegistrationDocument = (file: File) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`"${file.name}" must be a PDF, JPEG or PNG file.`);
  }
  if (file.size > MAX_DOCUMENT_BYTES) {
    throw new Error(`"${file.name}" is larger than 5 MB.`);
  }
};

export const uploadRegistrationDocument = async (file: File, registrationId: string): Promise<string> => {
  assertValidRegistrationDocument(file);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${registrationId}/${crypto.randomUUID()}-${safeName}`;

  const { error } = await supabase.storage.from(DOCUMENT_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error('Document upload failed:', error);
    throw new Error(`"${file.name}" could not be uploaded. Please try again.`);
  }

  return path;
};
