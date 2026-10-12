export type NotificationCodeType = "file_submitted" | "file_validated" | "file_inprocess" | "updating_file" | "file_wait_correction" | "file_correction";

export type NotificationTypeType = {
    id: number;
    name: string;
    code: NotificationCodeType;
};

type ForlderType = {
    id: number
    description: string;
    name: string
};

type NotificationForType = "Installateur" | "Contrôleur" | "Head Origination" | "Référent" | "Admin";

export type Notification = {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    is_read: boolean;
    url: string | null;
    sender: number;
    receiver: number;
    notification_type: NotificationTypeType;
    dossier: ForlderType;
    notification_for: NotificationForType;
};

type Pagination = {
    total_pages: number;
    page: number;
    per_page: number;
    total_entries: number;
}

export type NotificationType = {
    notifications: Notification[];
    pagination: Pagination;
};