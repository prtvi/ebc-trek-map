export const routeMeta: Record<
	string,
	{
		date: string;
		day?: string;
		pictures?: string[];
		mediaEnabled?: boolean;
		notes?: string;
		type?: 'full' | 'day' | 'p2p';
		q?: string;
	}
>;
