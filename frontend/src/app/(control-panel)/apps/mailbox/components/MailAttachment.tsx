import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { MailboxMailAttachment } from '../MailboxApi';

type MailAttachmentProps = {
	attachment: MailboxMailAttachment;
};

/**
 * The mail attachment.
 */
function MailAttachment(props: MailAttachmentProps) {
	const { attachment } = props;

	if (!attachment) {
		return null;
	}

	return (
		<div className="flex items-center m-3">
			{attachment?.type.startsWith('image/') && (
				<img
					className="w-9 h-9 rounded-md overflow-hidden"
					src={`/assets/images/apps/mailbox/${attachment.preview}`}
					alt="attachment"
				/>
			)}

			{attachment.type.startsWith('application/') && (
				<Box
					sx={{ backgroundColor: 'background.default' }}
					className="flex items-center justify-center w-9 h-9 rounded-md overflow-hidden"
				>
					<Typography className="flex items-center justify-center text-sm font-semibold">
						{attachment.type.split('/')[1].trim().toUpperCase()}
					</Typography>
				</Box>
			)}

			<div className="mx-3">
				<Typography className="text-md font-medium truncate">{attachment.name}</Typography>
				<Typography
					className="text-sm font-medium truncate"
					color="text.secondary"
				>
					{attachment.size / 1000} KB
				</Typography>
			</div>
		</div>
	);
}

export default MailAttachment;
