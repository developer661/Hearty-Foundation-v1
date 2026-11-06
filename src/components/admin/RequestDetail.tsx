import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Check, FileText, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminBadge } from './AdminBadge';
import { RequestDecisionDialog } from './RequestDecisionDialog';
import {
  AdminRequest,
  DOCUMENT_BUCKET,
  REQUEST_TYPE_LABELS,
  STATUS_LABELS,
  VERIFICATION_LABELS,
  formatDate,
  formatDateTime,
} from './adminTypes';

interface RequestDetailProps {
  requestId: string;
  onBack: () => void;
}

interface FieldDef {
  key: string;
  label: string;
}

interface SubjectConfig {
  columns: string;
  fields: FieldDef[];
  documentTable: string | null;
}

interface DocumentRow {
  id: string;
  document_type: string;
  file_name: string | null;
  file_url: string | null;
  file_size: number | null;
  created_at: string;
}

const SUBJECT_CONFIG: Record<string, SubjectConfig> = {
  volunteer_registrations: {
    columns: 'full_name, email, phone, date_of_birth, profession, experience, motivation, category_interests, created_at',
    documentTable: 'registration_documents',
    fields: [
      { key: 'full_name', label: 'Full name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'date_of_birth', label: 'Date of birth' },
      { key: 'profession', label: 'Profession' },
      { key: 'experience', label: 'Experience' },
      { key: 'motivation', label: 'Motivation' },
      { key: 'category_interests', label: 'Areas of interest' },
    ],
  },
  business_partner_registrations: {
    columns: 'company_name, contact_person, email, phone, nip, address, date_of_establishment, business_profile, created_at',
    documentTable: null,
    fields: [
      { key: 'company_name', label: 'Company name' },
      { key: 'contact_person', label: 'Contact person' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'nip', label: 'Tax number (NIP)' },
      { key: 'address', label: 'Address' },
      { key: 'date_of_establishment', label: 'Date of establishment' },
      { key: 'business_profile', label: 'Business profile' },
    ],
  },
  care_facility_registrations: {
    columns: 'name, organisation_type, email, address, secondary_address, krs, date_of_establishment, business_profile, detailed_description, created_at',
    documentTable: 'care_facility_documents',
    fields: [
      { key: 'name', label: 'Organisation name' },
      { key: 'organisation_type', label: 'Organisation type' },
      { key: 'email', label: 'Email' },
      { key: 'address', label: 'Address' },
      { key: 'secondary_address', label: 'Secondary address' },
      { key: 'krs', label: 'KRS number' },
      { key: 'date_of_establishment', label: 'Date of establishment' },
      { key: 'business_profile', label: 'Business profile' },
      { key: 'detailed_description', label: 'Detailed description' },
    ],
  },
  foundation_registrations: {
    columns: 'name, email, address, krs, date_of_establishment, business_profile, created_at',
    documentTable: 'foundation_documents',
    fields: [
      { key: 'name', label: 'Foundation name' },
      { key: 'email', label: 'Email' },
      { key: 'address', label: 'Address' },
      { key: 'krs', label: 'KRS number' },
      { key: 'date_of_establishment', label: 'Date of establishment' },
      { key: 'business_profile', label: 'Business profile' },
    ],
  },
};

const formatFieldValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '-';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '-';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) && value.length <= 10) return formatDate(value);
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) return formatDateTime(value);
  return String(value);
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const RequestDetail = ({ requestId, onBack }: RequestDetailProps) => {
  const [request, setRequest] = useState<AdminRequest | null>(null);
  const [subject, setSubject] = useState<Record<string, unknown> | null>(null);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [openingDocId, setOpeningDocId] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: requestData, error: requestError } = await supabase
      .from('admin_requests')
      .select('id, request_type, subject_table, subject_id, applicant_name, applicant_email, submitted_at, status, verification_level, decided_at, decision_reason')
      .eq('id', requestId)
      .maybeSingle();

    if (requestError || !requestData) {
      console.error('Error loading request:', requestError);
      setError('This request could not be found.');
      setLoading(false);
      return;
    }

    const req = requestData as AdminRequest;
    const config = SUBJECT_CONFIG[req.subject_table];
    if (!config) {
      setError('This request type is not supported.');
      setLoading(false);
      return;
    }

    const [subjectRes, docsRes] = await Promise.all([
      supabase.from(req.subject_table).select(config.columns).eq('id', req.subject_id).maybeSingle(),
      config.documentTable
        ? supabase
            .from(config.documentTable)
            .select('id, document_type, file_name, file_url, file_size, created_at')
            .eq('registration_id', req.subject_id)
            .order('created_at', { ascending: true })
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (subjectRes.error || docsRes.error) {
      console.error('Error loading request details:', subjectRes.error || docsRes.error);
      setError('We could not load the request details. Please try again.');
      setLoading(false);
      return;
    }

    setRequest(req);
    setSubject((subjectRes.data as Record<string, unknown> | null) ?? null);
    setDocuments((docsRes.data ?? []) as DocumentRow[]);
    setError(null);
    setLoading(false);
  }, [requestId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const openDocument = async (doc: DocumentRow) => {
    if (!doc.file_url) return;
    setOpeningDocId(doc.id);
    setDocumentError(null);
    const { data, error: signError } = await supabase.storage
      .from(DOCUMENT_BUCKET)
      .createSignedUrl(doc.file_url, 300);
    setOpeningDocId(null);
    if (signError || !data?.signedUrl) {
      console.error('Error creating signed URL:', signError);
      setDocumentError('The document could not be opened. Please try again.');
      return;
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <p className="text-gray-600">Loading request...</p>;
  }

  if (error || !request) {
    return (
      <div className="space-y-4">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700">
          <ArrowLeft className="w-4 h-4" />
          Back to approval queue
        </button>
        <p className="text-red-700">{error ?? 'This request could not be found.'}</p>
      </div>
    );
  }

  const config = SUBJECT_CONFIG[request.subject_table];
  const hasDocumentSection = Boolean(config?.documentTable);
  const statusTone = request.status === 'approved' ? 'green' : request.status === 'rejected' ? 'red-soft' : 'amber';

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to approval queue
      </button>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <AdminBadge tone="gray">{REQUEST_TYPE_LABELS[request.request_type]}</AdminBadge>
            <AdminBadge tone={statusTone}>{STATUS_LABELS[request.status]}</AdminBadge>
            {request.verification_level && (
              <AdminBadge tone={request.verification_level === 'verified' ? 'green' : 'amber'}>
                {VERIFICATION_LABELS[request.verification_level]}
              </AdminBadge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-700">{request.applicant_name}</h1>
          <p className="text-gray-600">
            {request.applicant_email} · Submitted {formatDateTime(request.submitted_at)}
          </p>
        </div>

        {request.status === 'pending' && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setDecision('approved')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => setDecision('rejected')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Submitted information</h2>
          {!subject || !config ? (
            <p className="text-gray-600">No submitted details were found.</p>
          ) : (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {config.fields.map((field) => (
                <div key={field.key} className={field.key === 'motivation' || field.key === 'business_profile' || field.key === 'detailed_description' ? 'sm:col-span-2' : ''}>
                  <dt className="text-xs uppercase tracking-wide text-gray-500">{field.label}</dt>
                  <dd className="mt-1 text-gray-700 whitespace-pre-line break-words">{formatFieldValue(subject[field.key])}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <aside className="space-y-6">
          <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Verification</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Level</dt>
                <dd>
                  {request.verification_level ? (
                    <AdminBadge tone={request.verification_level === 'verified' ? 'green' : 'amber'}>
                      {VERIFICATION_LABELS[request.verification_level]}
                    </AdminBadge>
                  ) : (
                    <span className="text-gray-500">Not yet determined</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Documents</dt>
                <dd className="text-gray-700">{documents.length}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Decided</dt>
                <dd className="text-gray-700 text-right">{formatDateTime(request.decided_at)}</dd>
              </div>
              {request.decision_reason && (
                <div>
                  <dt className="text-gray-600">Reason</dt>
                  <dd className="mt-1 text-gray-700 whitespace-pre-line">{request.decision_reason}</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-xs text-gray-600">
              Requests are verified when supporting documents are attached. Without documents they are partially verified.
            </p>
          </section>

          {hasDocumentSection && (
            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Documents</h2>
              {documentError && <p className="text-sm text-red-700 mb-3">{documentError}</p>}
              {documents.length === 0 ? (
                <p className="text-sm text-gray-600">No documents were uploaded.</p>
              ) : (
                <ul className="space-y-3">
                  {documents.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-red-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{doc.file_name || doc.document_type}</p>
                          <p className="text-xs text-gray-600">
                            {doc.document_type}
                            {doc.file_size ? ` · ${formatFileSize(doc.file_size)}` : ''}
                          </p>
                        </div>
                      </div>
                      {doc.file_url ? (
                        <button
                          onClick={() => openDocument(doc)}
                          disabled={openingDocId === doc.id}
                          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {openingDocId === doc.id ? 'Opening...' : 'View'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">No file</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </aside>
      </div>

      {decision && (
        <RequestDecisionDialog
          request={request}
          decision={decision}
          onClose={() => setDecision(null)}
          onDecided={() => {
            setDecision(null);
            setLoading(true);
            load();
          }}
        />
      )}
    </div>
  );
};
