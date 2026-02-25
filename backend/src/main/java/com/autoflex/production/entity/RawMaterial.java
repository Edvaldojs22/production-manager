package com.autoflex.production.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NonNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Table(name = "raw_materials")
@Data
@Entity
public class RawMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message ="The code cannot be blank" )
    @Column(nullable = false, unique = true)
    private String code;

    @NotBlank(message = "mandatory name")
    @Column(nullable = false)
    private String name;

    private String unit;

    @NotNull(message = "The stock cannot be negative")
    @Min(value =  0, message = "Stock quantity cannot be negative")
    @Column(nullable = false)
    private Double stockQuantity;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createDAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
