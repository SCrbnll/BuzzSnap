package scg.buzzsnap.controller;

import scg.Utils;
import scg.buzzsnap.model.Users;
import scg.buzzsnap.service.UsersService;
import scg.buzzsnap.security.jwt.JwtService;
import jakarta.validation.Valid;

import java.util.Map;
import java.util.NoSuchElementException;

import javax.naming.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private AuthenticationManager authManager;
    @Autowired private JwtService jwtService;
    @Autowired private UsersService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest login) {
        try {
            Users user = userService.getUserByEmail(login.email());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", "not_found",
                    "message", "El usuario no existe."
                ));
            }
	    if (!user.getPassword().equals(Utils.sha1(login.password))) {
            	return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", "not_found",
        	    "message", "Contraseña incorrecta."
                ));
            }

            String token = jwtService.generateToken(user);
            String refresh = jwtService.generateRefreshToken(user.getEmail());
            return ResponseEntity.ok(new JwtResponse(token, refresh));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "error", "unauthorized",
                "message", "Credenciales inválidas. Verifica tu email y contraseña."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "server_error",
                "message", "Ocurrió un error inesperado durante el login."
            ));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid Users newUser) {
        newUser.setPassword(Utils.sha1(newUser.getPassword()));
        if (newUser.getAvatarUrl() == null) {
            newUser.setAvatarUrl("https://github.com/SCrbnll.png");
        }
        if (newUser.getTheme() == null) {
            newUser.setTheme("purple");
        }
        if (newUser.getClosed() == null) {
            newUser.setClosed(false);
        }
        if (newUser.getDisplayName() == null || newUser.getDisplayName().isEmpty()) {
            newUser.setDisplayName(newUser.getName().toLowerCase());
        }
        Users savedUser = userService.saveUser(newUser);
        String token = jwtService.generateToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(new JwtResponse(token, refreshToken));
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRequest request) {
        if (!jwtService.validateToken(request.refreshToken())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token inválido");
        }
        String email = jwtService.extractUsername(request.refreshToken());
        Users user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
        }
        String newToken = jwtService.generateToken(user);
        return ResponseEntity.ok(new JwtResponse(newToken, request.refreshToken()));
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody Users updatedUser) {
    	Users actualUser = userService.getUser(updatedUser.getId());
		actualUser.setName(updatedUser.getName());
		actualUser.setEmail(updatedUser.getEmail());
		actualUser.setAvatarUrl(updatedUser.getAvatarUrl());
		actualUser.setDescription(updatedUser.getDescription());
		actualUser.setTheme(updatedUser.getTheme());
		userService.saveUser(actualUser); 
        String token = jwtService.generateToken(actualUser);
        String refreshToken = jwtService.generateRefreshToken(actualUser.getEmail());

        return ResponseEntity.ok(new JwtResponse(token, refreshToken));

    }

    record LoginRequest(
    	    @jakarta.validation.constraints.Email String email,
    	    @jakarta.validation.constraints.NotBlank String password
    	) {}
    record TokenRequest(String refreshToken) {}
    record JwtResponse(String token, String refreshToken) {}
}
