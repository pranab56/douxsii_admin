/**
 * Converts a button label (e.g. "Save", "Update", "Delete", "Submit", "Login")
 * to its continuous loading form (e.g. "Saving...", "Updating...", "Deleting...", "Submitting...", "Logging in...").
 */
export const getLoadingText = (text: string): string => {
    if (!text) return 'Loading...';
    const trimmed = text.trim();

    // Map common full strings directly for clean English phrasing
    const directMap: Record<string, string> = {
        'Save': 'Saving...',
        'Save Changes': 'Saving...',
        'Save Password': 'Saving Password...',
        'Update': 'Updating...',
        'Update Member': 'Updating Member...',
        'Create Member': 'Creating Member...',
        'Add Member': 'Adding Member...',
        'Add FAQ': 'Adding FAQ...',
        'Delete': 'Deleting...',
        'Delete FAQ': 'Deleting FAQ...',
        'Submit': 'Submitting...',
        'Login': 'Logging in...',
        'Log In': 'Logging in...',
        'Next': 'Verifying...',
        'Verify': 'Verifying...',
        'Send': 'Sending...',
        'Send Verification Code': 'Sending...',
        'Reset Password': 'Resetting Password...',
        'Block': 'Blocking...',
        'Block User': 'Blocking User...',
        'Block Vendor': 'Blocking Vendor...',
        'Unblock': 'Unblocking...',
        'Unblock User': 'Unblocking User...',
        'Unblock Vendor': 'Unblocking Vendor...',
        'Approve': 'Approving...',
        'Approve Campaign': 'Approving Campaign...',
        'Reject': 'Rejecting...',
        'Reject Campaign': 'Rejecting Campaign...',
        'Confirm': 'Confirming...',
        'Mark All as Read': 'Marking as Read...',
        'Resend': 'Resending...',
    };

    if (directMap[trimmed]) {
        return directMap[trimmed];
    }

    // Algorithmic fallback: transform the first word to -ing form
    const words = trimmed.split(' ');
    const firstWord = words[0];
    let ingWord = firstWord;

    if (firstWord.endsWith('e') && !firstWord.endsWith('ee')) {
        ingWord = firstWord.slice(0, -1) + 'ing';
    } else if (firstWord.endsWith('y')) {
        ingWord = firstWord + 'ing';
    } else if (/[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]$/i.test(firstWord) && firstWord.length <= 4) {
        ingWord = firstWord + firstWord.slice(-1) + 'ing';
    } else if (!firstWord.endsWith('ing')) {
        ingWord = firstWord + 'ing';
    }

    const rest = words.slice(1).join(' ');
    return `${ingWord}${rest ? ' ' + rest : ''}...`;
};
