import { supabase } from '../../lib/supabase';
import { ConfirmActionDialog } from './ConfirmActionDialog';
import { AdminRequest, describeAdminError } from './adminTypes';

interface RequestDecisionDialogProps {
  request: AdminRequest;
  decision: 'approved' | 'rejected';
  onClose: () => void;
  onDecided: () => void;
}

export const RequestDecisionDialog = ({ request, decision, onClose, onDecided }: RequestDecisionDialogProps) => {
  const submitDecision = async (reason: string): Promise<string | null> => {
    const { error } = await supabase.rpc('admin_decide_request', {
      p_request_id: request.id,
      p_decision: decision,
      p_reason: reason || null,
    });
    if (error) {
      console.error('Decision failed:', error);
      return describeAdminError(error.message);
    }
    onDecided();
    return null;
  };

  const approving = decision === 'approved';

  return (
    <ConfirmActionDialog
      title={approving ? 'Approve registration?' : 'Reject registration?'}
      description={
        approving
          ? `${request.applicant_name} will be approved. Their verification level is set automatically from the documents they provided.`
          : `${request.applicant_name} will be rejected. The reason is saved in the audit trail.`
      }
      confirmLabel={approving ? 'Approve' : 'Reject'}
      requireReason={!approving}
      reasonLabel="Reason for rejection"
      onConfirm={submitDecision}
      onClose={onClose}
    />
  );
};
