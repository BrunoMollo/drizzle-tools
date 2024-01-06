CREATE TABLE `ingredient` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `supplier` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `r_ingredient_ingredient` (
	`amount` real NOT NULL,
	`derived_id` integer NOT NULL,
	`source_id` integer NOT NULL,
	FOREIGN KEY (`derived_id`) REFERENCES `ingredient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_id`) REFERENCES `ingredient`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `r_ingredient_product` (
	`ingredient_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`amount` real NOT NULL,
	PRIMARY KEY(`ingredient_id`, `product_id`),
	FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `r_supplier_ingredient` (
	`supplier_id` integer NOT NULL,
	`ingredient_id` integer NOT NULL,
	PRIMARY KEY(`ingredient_id`, `supplier_id`),
	FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ingredient_id`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE no action
);
