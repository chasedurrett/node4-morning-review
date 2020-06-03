insert into coolusers (username, password)
values ($1, $2)
returning *;