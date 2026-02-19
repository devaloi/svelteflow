export interface KPI {
	label: string;
	value: string | number;
	trend: number;
	unit?: string;
}

export interface TimeSeriesPoint {
	label: string;
	value: number;
}

export interface SalesRecord {
	product: string;
	amount: number;
	customer: string;
	region: string;
	createdAt: string;
}

export interface MetricEvent {
	name: string;
	value: number;
	unit: string;
	timestamp: string;
}
