import * as shell from "shelljs";

// Membuat direktori "build/src/views" jika belum ada
shell.mkdir("-p", "build/src");

// copy all the view templates
shell.cp("-R", "src/views", "build/src");
